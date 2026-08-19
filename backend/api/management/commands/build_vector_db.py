import os
from django.core.management.base import BaseCommand
from django.conf import settings
from langchain_community.document_loaders import PyPDFLoader, CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

class Command(BaseCommand):
    help = 'Builds the vector database for the chatbot'

    def handle(self, *args, **kwargs):
        load_dotenv()
        
        # Paths
        BASE_DIR = settings.BASE_DIR
        DATA_PATH = os.path.join(BASE_DIR, 'data')
        DB_PATH = os.path.join(BASE_DIR, 'vectorstore')

        if not os.path.exists(DATA_PATH):
            self.stdout.write(self.style.ERROR(f"Data directory not found at {DATA_PATH}"))
            return

        self.stdout.write("Loading documents...")
        documents = []
        
        # Check if data directory is empty
        if not os.listdir(DATA_PATH):
             self.stdout.write(self.style.WARNING("No documents found in data/ directory. Vector store will be empty."))

        for file in os.listdir(DATA_PATH):
            path = os.path.join(DATA_PATH, file)
            try:
                if file.endswith(".pdf"):
                    loader = PyPDFLoader(path)
                    documents.extend(loader.load())
                    self.stdout.write(f"Loaded PDF: {file}")
                elif file.endswith(".csv"):
                    loader = CSVLoader(path)
                    documents.extend(loader.load())
                    self.stdout.write(f"Loaded CSV: {file}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error loading {file}: {str(e)}"))

        if not documents:
            self.stdout.write(self.style.WARNING("No valid documents loaded. Aborting."))
            return

        self.stdout.write("Splitting documents...")
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        chunks = splitter.split_documents(documents)
        self.stdout.write(f"Created {len(chunks)} text chunks.")

        self.stdout.write("Generating embeddings and vector store...")
        try:
            embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001"
            )
            
            db = FAISS.from_documents(chunks, embeddings)
            db.save_local(DB_PATH)
            
            self.stdout.write(self.style.SUCCESS(f"✅ Vector database created successfully at {DB_PATH}"))
            
        except Exception as e:
             self.stdout.write(self.style.ERROR(f"Failed to create vector store: {str(e)}"))

import os
from django.conf import settings
from dotenv import load_dotenv

from langchain_community.vectorstores import FAISS
from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI
)
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

class DocTalkChatbot:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init_bot()
        return cls._instance

    def _init_bot(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        self.chain = None

        if not api_key:
            print("❌ GOOGLE_API_KEY missing")
            return

        try:
            # Load vector DB
            db_path = os.path.join(settings.BASE_DIR, "vectorstore")
            if not os.path.exists(os.path.join(db_path, "index.faiss")):
                 raise FileNotFoundError("Vector store not found")

            embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=api_key
            )

            vectordb = FAISS.load_local(
                db_path,
                embeddings,
                allow_dangerous_deserialization=True
            )

            retriever = vectordb.as_retriever(search_kwargs={"k": 3})

            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                temperature=0.3,
                google_api_key=api_key
            )

            prompt = PromptTemplate(
                input_variables=["context", "question"],
                template="""
You are DocTalk AI, a medical assistant.
You do NOT diagnose diseases.
Use ONLY the provided context.
If unsure, say you don't know and advise consulting a doctor.

Context:
{context}

Question:
{question}

Answer:
"""
            )

            def format_docs(docs):
                return "\n\n".join(doc.page_content for doc in docs)

            self.chain = (
                {
                    "context": retriever | format_docs,
                    "question": lambda x: x
                }
                | prompt
                | llm
                | StrOutputParser()
            )

            print("✅ DocTalk chatbot ready")
            
        except Exception as e:
            print(f"❌ RAG init failed: {e}. Switching to fallback mode.")
            self._fallback_init(api_key)

    def _fallback_init(self, api_key):
        try:
            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                temperature=0.3,
                google_api_key=api_key
            )
            
            prompt = PromptTemplate(
                input_variables=["question"],
                template="You are DocTalk AI, a helpful medical assistant. Answer the user's question safely. Question: {question}"
            )
            
            from langchain_core.runnables import RunnablePassthrough
            
            self.chain = (
                {"question": RunnablePassthrough()}
                | prompt
                | llm
                | StrOutputParser()
            )
            print("⚠️ DocTalk chatbot running in fallback mode (No Context)")
        except Exception as e:
            print(f"❌ Fallback init failed: {e}")

    def get_response(self, query: str) -> str:
        if not self.chain:
            return "The chatbot is currently unavailable."

        if len(query) > 500:
            return "Please ask a shorter medical question."

        try:
            return self.chain.invoke(query)
        except Exception as e:
            if "429" in str(e):
                return "High traffic right now. Please try again shortly."
            return "An error occurred while processing your request."

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Pulso360 funcionando correctamente"}

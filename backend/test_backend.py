"""
Unit & Integration Test Suite for Aetheria Celestial Observer Backend.
"""

from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

def test_api_time():
    response = client.get("/api/time")
    assert response.status_code == 200
    data = response.json()
    assert "utc_iso" in data
    assert "julian_date" in data
    print("✓ /api/time passed")

def test_api_stars():
    response = client.get("/api/stars")
    assert response.status_code == 200
    data = response.json()
    assert len(data["stars"]) > 30
    assert len(data["constellations"]) >= 10
    print(f"✓ /api/stars passed ({len(data['stars'])} stars, {len(data['constellations'])} constellations)")

def test_api_ephemeris():
    response = client.get("/api/ephemeris?lat=35.6762&lon=139.6503")
    assert response.status_code == 200
    data = response.json()
    assert "sun" in data
    assert "moon" in data
    assert "planets" in data
    assert len(data["planets"]) == 5
    assert "phase_name" in data["moon"]
    print(f"✓ /api/ephemeris passed (Moon: {data['moon']['phase_name']}, illumination: {data['moon']['illumination']})")

def test_docs_downloads():
    resp_pdf = client.get("/api/download/pdf")
    assert resp_pdf.status_code == 200
    assert resp_pdf.headers["content-type"] == "application/pdf"

    resp_docx = client.get("/api/download/docx")
    assert resp_docx.status_code == 200
    assert "wordprocessingml" in resp_docx.headers["content-type"]
    print("✓ /api/download/pdf and /api/download/docx passed")

def test_static_frontend():
    response = client.get("/")
    assert response.status_code == 200
    assert "<title>Aetheria • Celestial Sky Observer</title>" in response.text
    print("✓ Static frontend / passed")

if __name__ == "__main__":
    test_api_time()
    test_api_stars()
    test_api_ephemeris()
    test_docs_downloads()
    test_static_frontend()
    print("\n🌟 ALL UNIT & INTEGRATION TESTS PASSED PERFECTLY!")

'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AnalysisResult {
  language: string;
  translationFallback: boolean;
  translationNote: string;
  summary: string;
  riskLevel: 'low' | 'moderate' | 'high';
  doctorPreference: string;
  doctorSuggestion: string;
  possibilities: Array<{
    disease: string;
    confidence: number;
    reason: string;
  }>;
  recommendedTests: string[];
  redFlags: string[];
  suggestions: string[];
  prescription: string[];
  matchedDoctors: Array<{
    id: string;
    name: string;
    specialist: string;
    city: string;
    availability: string;
  }>;
}

export default function SymptomAnalyzerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    duration: '',
    symptoms: '',
    severity: 'moderate',
    preferredLanguage: 'en',
    preferredCity: ''
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json() as AnalysisResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze symptoms');
    } finally {
      setLoading(false);
    }
  }

  const riskColors = {
    low: '#22c55e',
    moderate: '#f59e0b',
    high: '#ef4444'
  };

  return (
    <div className="tool-page">
      <header className="tool-header">
        <div className="tool-header-content">
          <div>
            <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1>🔍 Symptom Analyzer</h1>
            <p>Analyze your symptoms and get AI-powered medical insights</p>
          </div>
        </div>
      </header>

      <main className="tool-main">
        <div className="tool-container">
          {!result ? (
            <form onSubmit={handleSubmit} className="analysis-form">
              <div className="form-section">
                <h2>Patient Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g., 35"
                    />
                  </div>
                  <div className="form-group">
                    <label>Sex</label>
                    <select
                      required
                      value={formData.sex}
                      onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration of Symptoms</label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 3 days, 2 weeks"
                    />
                  </div>
                  <div className="form-group">
                    <label>Severity</label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    >
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Symptoms & Preferences</h2>

                <div className="form-group">
                  <label>Describe Your Symptoms</label>
                  <textarea
                    required
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    placeholder="Describe all symptoms you're experiencing..."
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Language</label>
                    <select
                      value={formData.preferredLanguage}
                      onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ur">Urdu</option>
                      <option value="bn">Bengali</option>
                      <option value="ta">Tamil</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City / Location (For Doctor Recommendation)</label>
                    <select
                      value={formData.preferredCity}
                      onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                    >
                      <option value="">Select your city...</option>
                      
                      <optgroup label="ANDHRA PRADESH">
                        <option value="Visakhapatnam">Visakhapatnam</option>
                        <option value="Vijayawada">Vijayawada</option>
                        <option value="Kurnool">Kurnool</option>
                        <option value="Tirupati">Tirupati</option>
                        <option value="Kakinada">Kakinada</option>
                        <option value="Rajahmundry">Rajahmundry</option>
                        <option value="Nellore">Nellore</option>
                        <option value="Tenali">Tenali</option>
                      </optgroup>

                      <optgroup label="ARUNACHAL PRADESH">
                        <option value="Itanagar">Itanagar</option>
                        <option value="Pasighat">Pasighat</option>
                        <option value="Tawang">Tawang</option>
                      </optgroup>

                      <optgroup label="ASSAM">
                        <option value="Guwahati">Guwahati</option>
                        <option value="Silchar">Silchar</option>
                        <option value="Dibrugarh">Dibrugarh</option>
                        <option value="Nagaon">Nagaon</option>
                      </optgroup>

                      <optgroup label="BIHAR">
                        <option value="Patna">Patna</option>
                        <option value="Gaya">Gaya</option>
                        <option value="Bhagalpur">Bhagalpur</option>
                        <option value="Muzaffarpur">Muzaffarpur</option>
                        <option value="Darbhanga">Darbhanga</option>
                        <option value="Purnia">Purnia</option>
                      </optgroup>

                      <optgroup label="CHHATTISGARH">
                        <option value="Raipur">Raipur</option>
                        <option value="Bhilai">Bhilai</option>
                        <option value="Durg">Durg</option>
                        <option value="Rajnandgaon">Rajnandgaon</option>
                      </optgroup>

                      <optgroup label="GOA">
                        <option value="Panaji">Panaji</option>
                        <option value="Margao">Margao</option>
                        <option value="Vasco da Gama">Vasco da Gama</option>
                      </optgroup>

                      <optgroup label="GUJARAT">
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Surat">Surat</option>
                        <option value="Vadodara">Vadodara</option>
                        <option value="Rajkot">Rajkot</option>
                        <option value="Bhavnagar">Bhavnagar</option>
                        <option value="Jamnagar">Jamnagar</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        <option value="Anand">Anand</option>
                        <option value="Junagadh">Junagadh</option>
                      </optgroup>

                      <optgroup label="HARYANA">
                        <option value="Gurgaon">Gurgaon</option>
                        <option value="Faridabad">Faridabad</option>
                        <option value="Hisar">Hisar</option>
                        <option value="Rohtak">Rohtak</option>
                        <option value="Panipat">Panipat</option>
                        <option value="Ambala">Ambala</option>
                        <option value="Yamunanagar">Yamunanagar</option>
                        <option value="Karnal">Karnal</option>
                      </optgroup>

                      <optgroup label="HIMACHAL PRADESH">
                        <option value="Shimla">Shimla</option>
                        <option value="Mandi">Mandi</option>
                        <option value="Solan">Solan</option>
                        <option value="Kangra">Kangra</option>
                      </optgroup>

                      <optgroup label="JHARKHAND">
                        <option value="Ranchi">Ranchi</option>
                        <option value="Jamshedpur">Jamshedpur</option>
                        <option value="Dhanbad">Dhanbad</option>
                        <option value="Giridih">Giridih</option>
                        <option value="Bokaro">Bokaro</option>
                        <option value="Deogarh">Deogarh</option>
                      </optgroup>

                      <optgroup label="KARNATAKA">
                        <option value="Bangalore">Bangalore</option>
                        <option value="Mangalore">Mangalore</option>
                        <option value="Mysore">Mysore</option>
                        <option value="Belgaum">Belgaum</option>
                        <option value="Gulbarga">Gulbarga</option>
                        <option value="Davangere">Davangere</option>
                        <option value="Tumkur">Tumkur</option>
                        <option value="Hassan">Hassan</option>
                        <option value="Hospet">Hospet</option>
                      </optgroup>

                      <optgroup label="KERALA">
                        <option value="Kochi">Kochi</option>
                        <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                        <option value="Kozhikode">Kozhikode</option>
                        <option value="Ernakulam">Ernakulam</option>
                        <option value="Kottayam">Kottayam</option>
                        <option value="Malappuram">Malappuram</option>
                        <option value="Kannur">Kannur</option>
                        <option value="Alappuzha">Alappuzha</option>
                      </optgroup>

                      <optgroup label="MADHYA PRADESH">
                        <option value="Indore">Indore</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Jabalpur">Jabalpur</option>
                        <option value="Gwalior">Gwalior</option>
                        <option value="Ujjain">Ujjain</option>
                        <option value="Sagar">Sagar</option>
                        <option value="Satna">Satna</option>
                        <option value="Ratlam">Ratlam</option>
                      </optgroup>

                      <optgroup label="MAHARASHTRA">
                        <option value="Mumbai">Mumbai</option>
                        <option value="Pune">Pune</option>
                        <option value="Nagpur">Nagpur</option>
                        <option value="Nashik">Nashik</option>
                        <option value="Aurangabad">Aurangabad</option>
                        <option value="Kolhapur">Kolhapur</option>
                        <option value="Amravati">Amravati</option>
                        <option value="Solapur">Solapur</option>
                        <option value="Latur">Latur</option>
                        <option value="Yavatmal">Yavatmal</option>
                        <option value="Jalgaon">Jalgaon</option>
                      </optgroup>

                      <optgroup label="MANIPUR">
                        <option value="Imphal">Imphal</option>
                        <option value="Bishnupur">Bishnupur</option>
                      </optgroup>

                      <optgroup label="MEGHALAYA">
                        <option value="Shillong">Shillong</option>
                        <option value="Tura">Tura</option>
                      </optgroup>

                      <optgroup label="MIZORAM">
                        <option value="Aizawl">Aizawl</option>
                        <option value="Lunglei">Lunglei</option>
                      </optgroup>

                      <optgroup label="NAGALAND">
                        <option value="Kohima">Kohima</option>
                        <option value="Dimapur">Dimapur</option>
                      </optgroup>

                      <optgroup label="ODISHA">
                        <option value="Bhubaneswar">Bhubaneswar</option>
                        <option value="Cuttack">Cuttack</option>
                        <option value="Rourkela">Rourkela</option>
                        <option value="Sambalpur">Sambalpur</option>
                        <option value="Puri">Puri</option>
                        <option value="Balasore">Balasore</option>
                      </optgroup>

                      <optgroup label="PUNJAB">
                        <option value="Amritsar">Amritsar</option>
                        <option value="Ludhiana">Ludhiana</option>
                        <option value="Jalandhar">Jalandhar</option>
                        <option value="Patiala">Patiala</option>
                        <option value="Bathinda">Bathinda</option>
                        <option value="Firozpur">Firozpur</option>
                        <option value="Moga">Moga</option>
                        <option value="Sangrur">Sangrur</option>
                      </optgroup>

                      <optgroup label="RAJASTHAN">
                        <option value="Jaipur">Jaipur</option>
                        <option value="Jodhpur">Jodhpur</option>
                        <option value="Udaipur">Udaipur</option>
                        <option value="Ajmer">Ajmer</option>
                        <option value="Bikaner">Bikaner</option>
                        <option value="Kota">Kota</option>
                        <option value="Bhilwara">Bhilwara</option>
                        <option value="Alwar">Alwar</option>
                        <option value="Barmer">Barmer</option>
                        <option value="Bundi">Bundi</option>
                        <option value="Chittorgarh">Chittorgarh</option>
                        <option value="Churu">Churu</option>
                        <option value="Dausa">Dausa</option>
                        <option value="Dholpur">Dholpur</option>
                        <option value="Dungarpur">Dungarpur</option>
                        <option value="Hanumangarh">Hanumangarh</option>
                        <option value="Jaisalmer">Jaisalmer</option>
                        <option value="Jalore">Jalore</option>
                        <option value="Jhalawar">Jhalawar</option>
                        <option value="Jhunjhunu">Jhunjhunu</option>
                        <option value="Karauli">Karauli</option>
                        <option value="Kishangarh">Kishangarh</option>
                        <option value="Nagaur">Nagaur</option>
                        <option value="Pali">Pali</option>
                        <option value="Pratapgarh">Pratapgarh</option>
                        <option value="Sawai Madhopur">Sawai Madhopur</option>
                        <option value="Sikar">Sikar</option>
                        <option value="Sirohi">Sirohi</option>
                        <option value="Tonk">Tonk</option>
                      </optgroup>

                      <optgroup label="SIKKIM">
                        <option value="Gangtok">Gangtok</option>
                        <option value="Darjeeling">Darjeeling</option>
                      </optgroup>

                      <optgroup label="TAMIL NADU">
                        <option value="Chennai">Chennai</option>
                        <option value="Coimbatore">Coimbatore</option>
                        <option value="Madurai">Madurai</option>
                        <option value="Salem">Salem</option>
                        <option value="Tiruchirappalli">Tiruchirappalli</option>
                        <option value="Tiruppur">Tiruppur</option>
                        <option value="Vellore">Vellore</option>
                        <option value="Thoothukudi">Thoothukudi</option>
                        <option value="Thanjavur">Thanjavur</option>
                        <option value="Erode">Erode</option>
                        <option value="Kanyakumari">Kanyakumari</option>
                        <option value="Nagercoil">Nagercoil</option>
                      </optgroup>

                      <optgroup label="TELANGANA">
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Secunderabad">Secunderabad</option>
                        <option value="Warangal">Warangal</option>
                        <option value="Nizamabad">Nizamabad</option>
                        <option value="Khammam">Khammam</option>
                        <option value="Ramagundam">Ramagundam</option>
                      </optgroup>

                      <optgroup label="TRIPURA">
                        <option value="Agartala">Agartala</option>
                        <option value="Udaipur">Udaipur</option>
                      </optgroup>

                      <optgroup label="UTTAR PRADESH">
                        <option value="Lucknow">Lucknow</option>
                        <option value="Kanpur">Kanpur</option>
                        <option value="Varanasi">Varanasi</option>
                        <option value="Agra">Agra</option>
                        <option value="Meerut">Meerut</option>
                        <option value="Allahabad">Allahabad</option>
                        <option value="Ghaziabad">Ghaziabad</option>
                        <option value="Mathura">Mathura</option>
                        <option value="Jhansi">Jhansi</option>
                        <option value="Bareilly">Bareilly</option>
                        <option value="Moradabad">Moradabad</option>
                        <option value="Gorakhpur">Gorakhpur</option>
                        <option value="Aligarh">Aligarh</option>
                        <option value="Saharanpur">Saharanpur</option>
                        <option value="Etawah">Etawah</option>
                        <option value="Mirzapur">Mirzapur</option>
                        <option value="Firozabad">Firozabad</option>
                        <option value="Noida">Noida</option>
                        <option value="Greater Noida">Greater Noida</option>
                        <option value="Bulandshahr">Bulandshahr</option>
                        <option value="Bijnor">Bijnor</option>
                        <option value="Azamgarh">Azamgarh</option>
                      </optgroup>

                      <optgroup label="UTTARAKHAND">
                        <option value="Dehradun">Dehradun</option>
                        <option value="Haridwar">Haridwar</option>
                        <option value="Nainital">Nainital</option>
                        <option value="Almora">Almora</option>
                        <option value="Pithoragarh">Pithoragarh</option>
                      </optgroup>

                      <optgroup label="WEST BENGAL">
                        <option value="Kolkata">Kolkata</option>
                        <option value="Asansol">Asansol</option>
                        <option value="Durgapur">Durgapur</option>
                        <option value="Siliguri">Siliguri</option>
                        <option value="Malda">Malda</option>
                        <option value="Kharagpur">Kharagpur</option>
                        <option value="Santipur">Santipur</option>
                        <option value="Balurghat">Balurghat</option>
                      </optgroup>

                      <optgroup label="NATIONAL CAPITAL TERRITORY">
                        <option value="Delhi">Delhi</option>
                        <option value="New Delhi">New Delhi</option>
                      </optgroup>
                      
                      <optgroup label="JHARKHAND">
                        <option value="Ranchi">Ranchi</option>
                        <option value="Jamshedpur">Jamshedpur</option>
                      </optgroup>
                      
                      <optgroup label="ODISHA">
                        <option value="Bhubaneswar">Bhubaneswar</option>
                      </optgroup>
                      
                      <optgroup label="BIHAR">
                        <option value="Patna">Patna</option>
                        <option value="Gaya">Gaya</option>
                      </optgroup>
                      
                      <optgroup label="ASSAM">
                        <option value="Guwahati">Guwahati</option>
                      </optgroup>
                      
                      <optgroup label="HIMACHAL PRADESH">
                        <option value="Shimla">Shimla</option>
                      </optgroup>
                      
                      <optgroup label="UTTARAKHAND">
                        <option value="Dehradun">Dehradun</option>
                      </optgroup>
                      
                      <optgroup label="GOA">
                        <option value="Panaji">Panaji</option>
                      </optgroup>
                      
                      <optgroup label="CHHATTISGARH">
                        <option value="Raipur">Raipur</option>
                      </optgroup>
                      
                      <optgroup label="GUJARAT">
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Surat">Surat</option>
                        <option value="Vadodara">Vadodara</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" disabled={loading} className="submit-button">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Symptoms'
                )}
              </button>
            </form>
          ) : (
            <div className="analysis-result">
              <div className="result-header">
                <h2>Analysis Results</h2>
                <button onClick={() => setResult(null)} className="new-analysis-btn">
                  New Analysis
                </button>
              </div>

              <div className="result-card risk-card">
                <div className="risk-badge" style={{ borderColor: riskColors[result.riskLevel] }}>
                  <span className="risk-level" style={{ color: riskColors[result.riskLevel] }}>
                    {result.riskLevel.toUpperCase()}
                  </span>
                  <span className="risk-label">Risk Level</span>
                </div>
                <div>
                  <h3>Summary</h3>
                  <p>{result.summary}</p>
                </div>
              </div>

              {/* Doctor Recommendation Section */}
              <div className="result-card doctor-recommendation-card">
                <div className="doctor-rec-header">
                  <h3>👨‍⚕️ Recommended Doctor</h3>
                  <span className="doctor-rec-badge">{result.doctorPreference}</span>
                </div>
                <p className="doctor-rec-suggestion">{result.doctorSuggestion}</p>
              </div>

              {result.translationFallback && (
                <div className="warning-card">
                  <span className="warning-icon">⚠️</span>
                  <div>
                    <h4>Translation Note</h4>
                    <p>{result.translationNote}</p>
                  </div>
                </div>
              )}

              <div className="result-card">
                <h3>Possible Conditions</h3>
                <div className="possibilities-list">
                  {result.possibilities.map((p, i) => (
                    <div key={i} className="possibility-item">
                      <div className="possibility-header">
                        <span className="disease-name">{p.disease}</span>
                        <span className="confidence-badge" style={{
                          backgroundColor: `rgba(34, 197, 94, ${p.confidence / 100})`
                        }}>
                          {Math.round(p.confidence)}%
                        </span>
                      </div>
                      <p>{p.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {result.redFlags.length > 0 && (
                <div className="result-card alert-card">
                  <h3>⚠️ Red Flags</h3>
                  <ul>
                    {result.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="result-card">
                <h3>Recommended Tests</h3>
                <ul className="tests-list">
                  {result.recommendedTests.map((test, i) => (
                    <li key={i}>✓ {test}</li>
                  ))}
                </ul>
              </div>

              <div className="result-card">
                <h3>Suggestions</h3>
                <ul className="suggestions-list">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>

              {result.prescription.length > 0 && (
                <div className="result-card">
                  <h3>💊 Prescription Guidance</h3>
                  <div className="prescription-list">
                    {result.prescription.map((med, i) => (
                      <div key={i} className="prescription-item">{med}</div>
                    ))}
                  </div>
                </div>
              )}

              {result.matchedDoctors.length > 0 && (
                <div className="result-card">
                  <h3>👨‍⚕️ Recommended Doctors</h3>
                  <div className="doctors-list">
                    {result.matchedDoctors.map((doctor) => (
                      <div key={doctor.id} className="doctor-item">
                        <div className="doctor-info">
                          <h4>{doctor.name}</h4>
                          <p>{doctor.specialist} • {doctor.city}</p>
                        </div>
                        <span className="availability-badge">{doctor.availability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .tool-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 25%, #f5f3ff 50%, #f0f9ff 75%, #ffffff 100%);
          padding-bottom: 40px;
        }

        .tool-header {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%);
          border-bottom: 2px solid rgba(59, 130, 246, 0.2);
          padding: 30px 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .tool-header-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(22, 163, 74, 0.1);
          border: 1.5px solid rgba(22, 163, 74, 0.4);
          border-radius: 8px;
          color: #16a34a;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          margin-bottom: 16px;
        }

        .back-link:hover {
          background: rgba(22, 163, 74, 0.2);
          border-color: #16a34a;
          transform: translateX(-4px);
        }

        .tool-header h1 {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin: 12px 0 8px 0;
          background: linear-gradient(135deg, #16a34a, #0891b2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tool-header p {
          color: #475569;
          margin: 0;
          font-size: 16px;
        }

        .tool-main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .tool-container {
          background: white;
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .analysis-form {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-section h2 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-section h2::before {
          content: '';
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #16a34a, #0891b2);
          border-radius: 2px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: #0f172a;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          background: linear-gradient(135deg, rgba(240, 249, 255, 0.8), rgba(245, 243, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #0f172a;
          font-family: inherit;
          font-size: 14px;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          background: white;
          border-color: #0891b2;
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }

        .error-message {
          padding: 12px;
          background: rgba(220, 38, 38, 0.1);
          border: 1.5px solid rgba(220, 38, 38, 0.3);
          border-radius: 8px;
          color: #dc2626;
          font-size: 13px;
          font-weight: 600;
        }

        .submit-button {
          padding: 14px;
          background: linear-gradient(135deg, #16a34a 0%, #0891b2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(22, 163, 74, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Results */
        .analysis-result {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .result-header h2 {
          margin: 0;
          font-size: 24px;
          color: #0f172a;
        }

        .new-analysis-btn {
          padding: 10px 16px;
          background: rgba(22, 163, 74, 0.1);
          border: 1.5px solid rgba(22, 163, 74, 0.4);
          color: #16a34a;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .new-analysis-btn:hover {
          background: rgba(22, 163, 74, 0.2);
          border-color: #16a34a;
        }

        .result-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
        }

        .result-card h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .result-card h3::before {
          content: '';
          width: 4px;
          height: 16px;
          background: linear-gradient(135deg, #16a34a, #0891b2);
          border-radius: 2px;
        }

        .risk-card {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .risk-badge {
          border: 2px solid;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          min-width: 120px;
          flex-shrink: 0;
          background: linear-gradient(135deg, rgba(240, 249, 255, 0.8), rgba(245, 243, 255, 0.8));
        }

        .risk-level {
          display: block;
          font-weight: 700;
          font-size: 18px;
        }

        .risk-label {
          display: block;
          color: #64748b;
          font-size: 12px;
          margin-top: 4px;
        }

        .warning-card {
          display: flex;
          gap: 12px;
          background: rgba(245, 158, 11, 0.08);
          border: 1.5px solid rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          padding: 16px;
        }

        .warning-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .warning-card h4 {
          margin: 0 0 4px 0;
          color: #ea580c;
          font-weight: 700;
        }

        .warning-card p {
          margin: 0;
          color: #92400e;
          font-size: 13px;
        }

        .possibilities-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .possibility-item {
          background: linear-gradient(135deg, rgba(240, 249, 255, 0.8), rgba(245, 243, 255, 0.8));
          border-left: 3px solid #16a34a;
          padding: 12px;
          border-radius: 6px;
        }

        .possibility-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .disease-name {
          font-weight: 700;
          color: #0f172a;
        }

        .confidence-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #16a34a, #0891b2);
        }

        .possibility-item p {
          margin: 0;
          color: #475569;
          font-size: 13px;
        }

        .alert-card {
          background: rgba(220, 38, 38, 0.08);
          border-color: rgba(220, 38, 38, 0.3);
        }

        .alert-card ul {
          margin: 0;
          padding-left: 20px;
          color: #dc2626;
        }

        .alert-card li {
          margin: 8px 0;
        }

        .tests-list {
          margin: 0;
          padding-left: 20px;
          color: #0f172a;
        }

        .tests-list li {
          margin: 8px 0;
        }

        .suggestions-list {
          margin: 0;
          padding-left: 20px;
          color: #0f172a;
        }

        .suggestions-list li {
          margin: 8px 0;
        }

        .prescription-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .prescription-item {
          background: linear-gradient(135deg, rgba(240, 249, 255, 0.8), rgba(245, 243, 255, 0.8));
          padding: 12px;
          border-left: 3px solid #0891b2;
          border-radius: 6px;
          color: #0f172a;
          font-size: 13px;
          font-weight: 600;
        }

        .doctors-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .doctor-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(240, 249, 255, 0.8), rgba(245, 243, 255, 0.8));
          padding: 12px;
          border-radius: 8px;
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
        }

        .doctor-item:hover {
          border-color: #0891b2;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.1);
        }

        .doctor-info h4 {
          margin: 0 0 4px 0;
          color: #0f172a;
          font-weight: 700;
        }

        .doctor-info p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
        }

        .availability-badge {
          background: rgba(22, 163, 74, 0.15);
          color: #16a34a;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }

        .doctor-recommendation-card {
          background: linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(8, 145, 178, 0.08));
          border: 2px solid rgba(22, 163, 74, 0.3);
          position: relative;
          overflow: hidden;
        }

        .doctor-recommendation-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #16a34a, #0891b2);
        }

        .doctor-rec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .doctor-rec-header h3 {
          margin: 0;
          font-size: 18px;
          color: #16a34a;
        }

        .doctor-rec-badge {
          display: inline-block;
          background: linear-gradient(135deg, #16a34a, #0891b2);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .doctor-rec-suggestion {
          margin: 0;
          color: #475569;
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .tool-header h1 {
            font-size: 24px;
          }

          .result-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .risk-card {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Upload, FileText, Briefcase, PlayFill } from 'react-bootstrap-icons';

const SetupPage = ({ onStartInterview }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    jobDescription: '',
    numQuestions: 10,
    difficulty: 'Medium',
    interviewType: 'Mixed'
  });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'text/plain')) {
      setCvFile(file);
      setError(null);
    } else {
      setError('Please upload a valid PDF, DOCX, or TXT file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      setError('Please upload your CV/Resume to proceed.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create FormData to send file and metadata
      const data = new FormData();
      data.append('cv', cvFile);
      data.append('fullName', formData.fullName);
      data.append('jobTitle', formData.jobTitle);
      data.append('jobDescription', formData.jobDescription);
      data.append('numQuestions', formData.numQuestions);
      data.append('difficulty', formData.difficulty);
      data.append('interviewType', formData.interviewType);

      // We'll build this API endpoint next
      const response = await fetch('/api/process-setup', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to process setup');

      onStartInterview(result.interviewData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h2 className="mb-4 fw-bold">Interview Setup</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Full Name (Optional)</Form.Label>
                <Form.Control 
                  type="text" 
                  name="fullName"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Upload CV (PDF, DOCX, TXT)</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control 
                    type="file" 
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    required
                  />
                  {cvFile && <FileText className="text-success" size={24} />}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Job Title</Form.Label>
                <Form.Control 
                  type="text" 
                  name="jobTitle"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Job Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4}
                  name="jobDescription"
                  placeholder="Paste the job requirements here..."
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Questions</Form.Label>
                    <Form.Select 
                      name="numQuestions"
                      value={formData.numQuestions}
                      onChange={handleInputChange}
                    >
                      {[...Array(6)].map((_, i) => (
                        <option key={i+5} value={i+5}>{i+5}</option>
                      ))}
                      <option value={15}>15 (Max)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Difficulty</Form.Label>
                    <Form.Select 
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Interview Type</Form.Label>
                <Form.Select 
                  name="interviewType"
                  value={formData.interviewType}
                  onChange={handleInputChange}
                >
                  <option>HR / Career</option>
                  <option>Technical</option>
                  <option>Behavioral</option>
                  <option>Mixed</option>
                </Form.Select>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <><Spinner animation="border" size="sm" /> Preparing Interview...</>
                ) : (
                  <><PlayFill size={20} /> Start Interview</>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SetupPage;

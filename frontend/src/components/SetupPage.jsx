import { useState, useRef } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Upload, FileText, Briefcase, PlayFill, Person, ChatDots, XCircle, Star, Lightning, Fire, Suitcase, Code, People, Grid, LockFill } from 'react-bootstrap-icons';
import { motion, AnimatePresence } from 'framer-motion';

const DIFFICULTIES = [
  { value: 'Easy', label: 'Easy', icon: Star },
  { value: 'Medium', label: 'Medium', icon: Lightning },
  { value: 'Hard', label: 'Hard', icon: Fire },
];

const INTERVIEW_TYPES = [
  { value: 'HR', label: 'HR / Career', icon: Suitcase },
  { value: 'Technical', label: 'Technical', icon: Code },
  { value: 'Behavioral', label: 'Behavioral', icon: People },
  { value: 'Mixed', label: 'Mixed', icon: Grid },
];

const SegmentedControl = ({ options, value, onChange, layoutId }) => (
  <div className="segmented-control" role="radiogroup">
    {options.map(({ value: optValue, label, icon: Icon }) => {
      const isActive = value === optValue;
      return (
        <button
          type="button"
          key={optValue}
          role="radio"
          aria-checked={isActive}
          className={`segmented-option${isActive ? ' is-active' : ''}`}
          onClick={() => onChange(optValue)}
        >
          {isActive && (
            <motion.span
              layoutId={layoutId}
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ background: 'var(--ink-100)', borderRadius: 'var(--radius-sm)', zIndex: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <Icon size={14} style={{ position: 'relative', zIndex: 1 }} />
          <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
        </button>
      );
    })}
  </div>
);

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
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setField = (name) => (value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'text/plain')) {
      setCvFile(file);
      setError(null);
    } else if (file) {
      setError('Please upload a valid PDF, DOCX, or TXT file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      const data = new FormData();
      data.append('cv', cvFile);
      data.append('fullName', formData.fullName);
      data.append('jobTitle', formData.jobTitle);
      data.append('jobDescription', formData.jobDescription);
      data.append('numQuestions', formData.numQuestions);
      data.append('difficulty', formData.difficulty);
      data.append('interviewType', formData.interviewType);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={7}>
          <Card className="setup-card border-0">
            <div className="card-header-custom">
              <h2>Set up your interview</h2>
              <p>A few details so the AI can tailor its questions to you</p>
            </div>

            <Card.Body className="p-4 p-md-5">

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert className="custom-alert">
                      <XCircle className="me-2" /> {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <Person className="me-2" size={14} /> Full Name (Optional)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="e.g., John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <Upload className="me-2" size={14} /> Upload CV/Resume
                  </Form.Label>
                  <div
                    className={`file-upload-wrapper ${dragOver ? 'drag-over' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="file-input-hidden"
                      style={{ display: 'none' }}
                    />
                    {!cvFile ? (
                      <>
                        <div className="file-upload-icon">
                          <Upload size={20} />
                        </div>
                        <div className="file-upload-text">
                          Drag & drop your CV here or click to browse
                        </div>
                        <div className="file-upload-small mt-2">
                          Supports PDF, DOCX, TXT (Max 10MB)
                        </div>
                      </>
                    ) : (
                      <div className="file-selected">
                        <div className="d-flex align-items-center gap-2">
                          <FileText color="#036b4c" size={20} />
                          <span className="fw-semibold">{cvFile.name}</span>
                          <small className="text-muted-ink">
                            ({(cvFile.size / 1024).toFixed(1)} KB)
                          </small>
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                          className="text-danger text-decoration-none"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <Briefcase className="me-2" size={14} /> Job Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="jobTitle"
                    placeholder="e.g., Senior Frontend Developer"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label">
                    <ChatDots className="me-2" size={14} /> Job Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="jobDescription"
                    placeholder="Paste the job requirements, responsibilities, and qualifications here..."
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  />
                </Form.Group>

                <div className="border-top pt-4 mt-2 mb-4">
                  <h6 className="fw-bold mb-3">Interview Configuration</h6>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">Number of Questions</Form.Label>
                    <Form.Select
                      name="numQuestions"
                      value={formData.numQuestions}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {[5,6,7,8,9,10,11,12,13,14,15].map(num => (
                        <option key={num} value={num}>{num} questions</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">Difficulty Level</Form.Label>
                    <SegmentedControl
                      options={DIFFICULTIES}
                      value={formData.difficulty}
                      onChange={setField('difficulty')}
                      layoutId="difficulty-highlight"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Interview Type</Form.Label>
                    <SegmentedControl
                      options={INTERVIEW_TYPES}
                      value={formData.interviewType}
                      onChange={setField('interviewType')}
                      layoutId="type-highlight"
                    />
                  </Form.Group>
                </div>

                <motion.button
                  type="submit"
                  className="btn-start-interview w-100 d-flex align-items-center justify-content-center gap-2 border-0 text-white"
                  disabled={loading}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Preparing your interview...</span>
                    </>
                  ) : (
                    <>
                      <PlayFill size={20} />
                      <span>Start Interview</span>
                    </>
                  )}
                </motion.button>

                <div className="text-center mt-4">
                  <small className="text-muted-ink">
                    <LockFill className="me-1" size={12} /> Your data is secure and only used for this interview session
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default SetupPage;

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Spinner, Button, Accordion, Badge } from 'react-bootstrap';
import { TrophyFill, ChatQuoteFill, LightbulbFill, ArrowRepeat } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';

const ResultsPage = ({ results, interviewData, onRestart }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await fetch('/api/evaluate-interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: results,
            jobTitle: interviewData.jobTitle,
            difficulty: interviewData.difficulty
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Evaluation failed');
        setEvaluation(data.evaluation);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [results, interviewData]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="grow" variant="primary" className="mb-4" />
        <h2 className="fw-bold">Analyzing Your Performance...</h2>
        <p className="text-muted">Gemini is reviewing your answers and preparing feedback.</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-danger">Evaluation Error</h2>
        <p>{error}</p>
        <Button onClick={onRestart}>Try Again</Button>
      </Container>
    );
  }

  const { scores, overallScore, strengths, improvements, suggestedQuestions } = evaluation;

  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-5">
          <TrophyFill size={60} className="text-warning mb-3" />
          <h1 className="display-4 fw-bold">Interview Results</h1>
          <p className="lead text-muted">Great job completing the interview for {interviewData.jobTitle}!</p>
        </div>

        <Row className="gy-4">
          {/* Overall Score Card */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 h-100 text-center p-4">
              <h3 className="fw-bold mb-4">Overall Score</h3>
              <div className="position-relative d-inline-block mx-auto mb-4">
                <div style={{ width: '150px', height: '150px' }} className="d-flex align-items-center justify-content-center border border-primary border-5 rounded-circle">
                  <h1 className="display-3 fw-bold mb-0 text-primary">{overallScore}</h1>
                </div>
              </div>
              <p className="text-muted">Out of 100 points</p>
              <hr />
              <div className="text-start">
                {Object.entries(scores).map(([category, score]) => (
                  <div key={category} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-capitalize fw-semibold">{category}</span>
                      <span className="fw-bold">{score}%</span>
                    </div>
                    <ProgressBar now={score} variant="primary" style={{ height: '8px' }} />
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Feedback Section */}
          <Col lg={8}>
            <Row className="gy-4">
              <Col md={6}>
                <Card className="shadow-sm border-0 h-100 bg-success bg-opacity-10">
                  <Card.Body className="p-4">
                    <h4 className="fw-bold text-success mb-3"><ChatQuoteFill className="me-2" /> Key Strengths</h4>
                    <ul className="mb-0">
                      {strengths.map((s, i) => <li key={i} className="mb-2 fw-medium">{s}</li>)}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shadow-sm border-0 h-100 bg-info bg-opacity-10">
                  <Card.Body className="p-4">
                    <h4 className="fw-bold text-info mb-3"><LightbulbFill className="me-2" /> Areas to Improve</h4>
                    <ul className="mb-0">
                      {improvements.map((imp, i) => <li key={i} className="mb-2 fw-medium">{imp}</li>)}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12}>
                <Card className="shadow-sm border-0 p-4">
                  <h4 className="fw-bold mb-4">Detailed Question Analysis</h4>
                  <Accordion flush>
                    {results.map((item, index) => (
                      <Accordion.Item eventKey={index.toString()} key={index}>
                        <Accordion.Header>
                          <div className="d-flex flex-column">
                            <span className="fw-bold">Q{index + 1}: {item.question}</span>
                            <small className="text-muted">Category: {item.category}</small>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <p className="mb-2"><strong>Your Answer:</strong></p>
                          <p className="text-dark p-3 bg-light rounded">{item.answer || "No answer recorded."}</p>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="mt-5 p-4 border rounded bg-light">
          <h4 className="fw-bold mb-3"><ArrowRepeat className="me-2" /> Suggested Questions to Practice Next</h4>
          <div className="d-flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <Badge key={i} bg="white" text="dark" className="border p-2 px-3 fw-medium">{q}</Badge>
            ))}
          </div>
        </div>

        <div className="text-center mt-5">
          <Button size="lg" variant="primary" className="px-5 py-3 fw-bold" onClick={onRestart}>
            Take Another Interview
          </Button>
        </div>
      </motion.div>
    </Container>
  );
};

export default ResultsPage;

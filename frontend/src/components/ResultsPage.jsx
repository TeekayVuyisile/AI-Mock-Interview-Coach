import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Spinner, Button, Accordion, Badge } from 'react-bootstrap';
import { TrophyFill, ChatQuoteFill, LightbulbFill, ArrowRepeat } from 'react-bootstrap-icons';
import { motion, animate } from 'framer-motion';

const ScoreRing = ({ score }) => {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [score]);

  return (
    <div className="score-ring position-relative">
      <svg viewBox="0 0 160 160" width="100%" height="100%">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--ink-100)" strokeWidth="12" />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--accent-600)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <div className="score-ring-value">{display}</div>
      </div>
    </div>
  );
};

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
        <Spinner animation="grow" variant="success" className="mb-4" />
        <h2 className="fw-bold">Analyzing your performance...</h2>
        <p className="text-muted-ink">Gemini is reviewing your answers and preparing feedback.</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-danger">Evaluation error</h2>
        <p className="text-muted-ink">{error}</p>
        <Button className="btn-hero-primary border-0" onClick={onRestart}>Try Again</Button>
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
          <TrophyFill size={44} color="#036b4c" className="mb-3" />
          <h1 className="display-5 fw-bold">Interview Results</h1>
          <p className="lead text-muted-ink">Great job completing the interview for {interviewData.jobTitle}</p>
        </div>

        <Row className="gy-4">
          {/* Overall Score Card */}
          <Col lg={4}>
            <Card className="score-ring-card border-0 h-100 text-center p-4">
              <h3 className="fw-bold mb-4">Overall Score</h3>
              <ScoreRing score={overallScore} />
              <p className="text-muted-ink mt-3">Out of 100 points</p>
              <hr />
              <div className="text-start">
                {Object.entries(scores).map(([category, score]) => (
                  <div key={category} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-capitalize fw-semibold">{category}</span>
                      <span className="fw-bold">{score}%</span>
                    </div>
                    <ProgressBar now={score} variant="success" style={{ height: '6px', borderRadius: 'var(--radius-pill)' }} />
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Feedback Section */}
          <Col lg={8}>
            <Row className="gy-4">
              <Col md={6}>
                <Card className="result-panel result-panel-positive h-100 border-0">
                  <Card.Body className="p-4">
                    <h4 className="fw-bold mb-3" style={{ color: 'var(--accent-700)' }}><ChatQuoteFill className="me-2" /> Key Strengths</h4>
                    <ul className="mb-0">
                      {strengths.map((s, i) => <li key={i} className="mb-2 fw-medium">{s}</li>)}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="result-panel result-panel-neutral h-100 border-0">
                  <Card.Body className="p-4">
                    <h4 className="fw-bold mb-3" style={{ color: 'var(--ink-800)' }}><LightbulbFill className="me-2" /> Areas to Improve</h4>
                    <ul className="mb-0">
                      {improvements.map((imp, i) => <li key={i} className="mb-2 fw-medium">{imp}</li>)}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12}>
                <Card className="result-panel border-0 p-4">
                  <h4 className="fw-bold mb-4">Detailed Question Analysis</h4>
                  <Accordion flush>
                    {results.map((item, index) => (
                      <Accordion.Item eventKey={index.toString()} key={index}>
                        <Accordion.Header>
                          <div className="d-flex flex-column">
                            <span className="fw-bold">Q{index + 1}: {item.question}</span>
                            <small className="text-muted-ink">Category: {item.category}</small>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <p className="mb-2"><strong>Your Answer:</strong></p>
                          <p className="p-3" style={{ background: 'var(--paper)', borderRadius: 'var(--radius-sm)', color: 'var(--ink-800)' }}>{item.answer || "No answer recorded."}</p>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="mt-5 p-4 result-panel result-panel-neutral">
          <h4 className="fw-bold mb-3"><ArrowRepeat className="me-2" /> Suggested Questions to Practice Next</h4>
          <div className="d-flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <Badge key={i} bg="white" text="dark" className="border p-2 px-3 fw-medium" style={{ borderRadius: 'var(--radius-pill)' }}>{q}</Badge>
            ))}
          </div>
        </div>

        <div className="text-center mt-5">
          <motion.button
            className="btn-hero-primary border-0 px-5 py-3"
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
          >
            Take Another Interview
          </motion.button>
        </div>
      </motion.div>
    </Container>
  );
};

export default ResultsPage;

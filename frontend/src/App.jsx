import { useState } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { MicFill, ShieldCheck, LightningChargeFill, ArrowRight, Broadcast, Trophy } from 'react-bootstrap-icons'
import { motion } from 'framer-motion'
import SetupPage from './components/SetupPage'
import InterviewPage from './components/InterviewPage'
import ResultsPage from './components/ResultsPage'
import './App.css'

function App() {
  const [page, setPage] = useState('landing')
  const [interviewData, setInterviewData] = useState(null)
  const [results, setResults] = useState(null)
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  const handleStartInterview = (data) => {
    setInterviewData(data)
    setPage('interview')
  }

  const handleEndInterview = (userAnswers) => {
    if (!userAnswers) {
      setPage('landing')
      setInterviewData(null)
      return
    }
    setResults(userAnswers)
    setPage('results')
  }

  const handleRestart = () => {
    setResults(null)
    setInterviewData(null)
    setPage('landing')
  }

  const waveformBars = [10, 22, 14, 28, 18, 24, 12]

  const renderLanding = () => (
    <>
      <Container className="hero-section">
        <Row className="align-items-center gy-5">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="hero-heading">
                Walk into your next interview <span className="accent-underline">already confident</span>
              </h1>
              <p className="hero-subtext">
                Upload your CV, talk it out with a voice-driven AI interviewer, and get scored feedback built around the job you actually want.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <motion.button
                  className="btn-hero-primary d-flex align-items-center gap-2 border-0"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPage('setup')}
                >
                  Start Mock Interview <ArrowRight size={16} />
                </motion.button>
                <button
                  className="btn-hero-secondary"
                  onClick={() => setShowHowItWorks(true)}
                >
                  How it works
                </button>
              </div>
            </motion.div>
          </Col>

          <Col lg={6}>
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-visual-card">
                <div className="hero-visual-top">
                  <div className="hero-visual-orb">
                    <MicFill size={22} color="#0c130f" />
                  </div>
                  <div className="hero-visual-waveform" aria-hidden="true">
                    {waveformBars.map((h, i) => (
                      <motion.span
                        key={i}
                        style={{ height: h, transformOrigin: 'bottom' }}
                        animate={{ scaleY: [1, 1.8, 1] }}
                        transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.08, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                </div>

                <p className="hero-visual-question">
                  "Tell me about a time you shipped something under pressure."
                </p>

                <div className="hero-visual-footer">
                  <span className="hero-visual-caption">Behavioral</span>
                  <span className="hero-visual-caption">Question 3 of 10</span>
                </div>
              </div>

              <motion.div
                className="hero-floating-chip chip-score"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Trophy size={16} color="#036b4c" /> Score 92
              </motion.div>

              <motion.div
                className="hero-floating-chip chip-live"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <span className="chip-dot" /> Listening
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <Container className="feature-section">
        <Row className="g-4">
          <Col lg={6}>
            <motion.div
              className="feature-card feature-card-primary"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              <span className="feature-card-primary-live"><span className="live-dot" /> Live session</span>

              <div className="feature-card-primary-visual" aria-hidden="true">
                <div className="feature-card-primary-orb">
                  <MicFill size={22} color="#0c130f" />
                </div>
                <div className="feature-card-primary-waveform">
                  {waveformBars.map((h, i) => (
                    <motion.span
                      key={i}
                      style={{ height: h, transformOrigin: 'bottom' }}
                      animate={{ scaleY: [1, 1.6, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.09, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3>Real conversations, not multiple choice</h3>
                <p>The AI asks, you answer out loud, and it follows up like a recruiter would. No scripts, no typing.</p>
              </div>
            </motion.div>
          </Col>
          <Col lg={6}>
            <Row className="g-4 h-100">
              <Col md={12}>
                <motion.div
                  className="feature-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="feature-icon-box">
                    <LightningChargeFill size={18} />
                  </div>
                  <h3>Scored on what matters</h3>
                  <p>Confidence, clarity, and technical depth, broken down per answer.</p>
                </motion.div>
              </Col>
              <Col md={12}>
                <motion.div
                  className="feature-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="feature-icon-box">
                    <ShieldCheck size={18} />
                  </div>
                  <h3>Nothing is kept</h3>
                  <p>Your CV and recordings are processed in memory and discarded right after.</p>
                </motion.div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <Modal show={showHowItWorks} onHide={() => setShowHowItWorks(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">How it works</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="gy-4">
            <Col md={6}>
              <div className="how-it-works-step">
                <div className="how-it-works-number">1</div>
                <div>
                  <h5>Setup</h5>
                  <p>Upload your CV and paste the job description so the AI understands the role.</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="how-it-works-step">
                <div className="how-it-works-number">2</div>
                <div>
                  <h5>Generation</h5>
                  <p>Gemini writes questions tailored to your background and the target role.</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="how-it-works-step">
                <div className="how-it-works-number">3</div>
                <div>
                  <h5>Voice interview</h5>
                  <p>The AI asks each question out loud. You answer with your mic, live transcript included.</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="how-it-works-step">
                <div className="how-it-works-number">4</div>
                <div>
                  <h5>Feedback</h5>
                  <p>Get a score, strengths, and specific areas to improve based on your real answers.</p>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-hero-primary border-0" onClick={() => setShowHowItWorks(false)}>Got it</Button>
        </Modal.Footer>
      </Modal>
    </>
  )

  const renderContent = () => {
    switch (page) {
      case 'landing':
        return renderLanding()
      case 'setup':
        return (
          <Container className="py-5">
            <SetupPage onStartInterview={handleStartInterview} />
          </Container>
        )
      case 'interview':
        return (
          <InterviewPage
            interviewData={interviewData}
            onEndInterview={handleEndInterview}
          />
        )
      case 'results':
        return (
          <ResultsPage
            results={results}
            interviewData={interviewData}
            onRestart={handleRestart}
          />
        )
      default:
        return renderLanding()
    }
  }

  return (
    <div className="App">
      <nav className="site-navbar">
        <Container className="d-flex align-items-center justify-content-between">
          <a className="navbar-brand" href="/" onClick={(e) => { e.preventDefault(); handleRestart(); }}>
            <span className="navbar-brand-mark"><Broadcast size={18} /></span>
            AI Interview Coach
          </a>
          {page === 'landing' && (
            <button className="btn-nav-cta" onClick={() => setPage('setup')}>
              Start Interview
            </button>
          )}
        </Container>
      </nav>

      <main>
        {renderContent()}
      </main>

      <footer className="site-footer">
        <Container className="text-center">
          <p>&copy; 2026 AI Mock Interview Coach. Built for recruiters &amp; developers.</p>
        </Container>
      </footer>
    </div>
  )
}

export default App

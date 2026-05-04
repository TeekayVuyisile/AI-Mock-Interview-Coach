import { useState } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { MicFill, ShieldCheck, LightningChargeFill, InfoCircleFill } from 'react-bootstrap-icons'
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

  const renderLanding = () => (
    <Container className="py-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="display-3 fw-bold mb-4">
          Master Your Next Interview with <span className="text-primary">AI</span>
        </h1>
        <p className="lead mb-5 text-secondary">
          Upload your CV, speak to our AI interviewer, and get real-time feedback to land your dream job.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button size="lg" variant="primary" onClick={() => setPage('setup')}>
            Start Mock Interview
          </Button>
          <Button size="lg" variant="outline-dark" onClick={() => setShowHowItWorks(true)}>
            How it works
          </Button>
        </div>
      </motion.div>

      <Row className="mt-5 pt-5">
        <Col md={4}>
          <div className="p-4 border rounded shadow-sm h-100">
            <LightningChargeFill size={40} className="text-warning mb-3" />
            <h3>Real-time Voice</h3>
            <p className="text-muted">Speak naturally. Our AI listens and responds just like a human recruiter.</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="p-4 border rounded shadow-sm h-100">
            <MicFill size={40} className="text-danger mb-3" />
            <h3>Speech Analysis</h3>
            <p className="text-muted">Get feedback on your confidence, clarity, and technical depth.</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="p-4 border rounded shadow-sm h-100">
            <ShieldCheck size={40} className="text-success mb-3" />
            <h3>Privacy First</h3>
            <p className="text-muted">Your CV and recordings are processed in-memory and never stored permanently.</p>
          </div>
        </Col>
      </Row>

      <Modal show={showHowItWorks} onHide={() => setShowHowItWorks(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">How It Works</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="gy-4 text-start">
            <Col md={6}>
              <div className="d-flex gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>1</div>
                <div>
                  <h5 className="fw-bold">Setup</h5>
                  <p className="text-muted">Upload your CV and paste the job description. Our AI analyzes both to understand the role.</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>2</div>
                <div>
                  <h5 className="fw-bold">Generation</h5>
                  <p className="text-muted">Gemini generates unique, tailored interview questions specifically for your background.</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>3</div>
                <div>
                  <h5 className="fw-bold">Voice Interview</h5>
                  <p className="text-muted">The AI speaks questions. You reply using your mic. We show a live transcript of your answer.</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>4</div>
                <div>
                  <h5 className="fw-bold">Feedback</h5>
                  <p className="text-muted">Receive a detailed score, strengths, and areas to improve based on your actual responses.</p>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowHowItWorks(false)}>Got it!</Button>
        </Modal.Footer>
      </Modal>
    </Container>
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
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
        <Container>
          <a className="navbar-brand fw-bold text-primary" href="/" onClick={(e) => { e.preventDefault(); handleRestart(); }}>
            AI Interview Coach
          </a>
        </Container>
      </nav>

      <main>
        {renderContent()}
      </main>

      <footer className="py-5 bg-light mt-5 border-top">
        <Container className="text-center">
          <p className="text-muted mb-0">© 2026 AI Mock Interview Coach. Built for Recruiters & Developers.</p>
        </Container>
      </footer>
    </div>
  )
}

export default App

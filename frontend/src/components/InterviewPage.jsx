import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, ProgressBar, Card, Badge } from 'react-bootstrap';
import { MicFill, StopFill, SkipForwardFill, XCircleFill, ChatRightTextFill } from 'react-bootstrap-icons';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewPage = ({ interviewData, onEndInterview }) => {
  const { questions, jobTitle } = interviewData;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState([]);
  const [showTranscript, setShowTranscript] = useState(true);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript.trim());
      };

      recognitionRef.current.onend = () => {
        // Only restart if we are still in "listening" mode
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Usually occurs if already started, safe to ignore
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') {
          // Keep listening even if silence is detected initially
          return;
        }
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // Speak the question whenever it changes
  useEffect(() => {
    if (currentQuestion) {
      speakQuestion(currentQuestion.question);
    }
  }, [currentQuestionIndex]);

  const speakQuestion = (text) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      startListening(); // Automatically start listening after AI finishes
    };

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleNextQuestion = () => {
    // Save current answer
    const newAnswers = [...answers, {
      question: currentQuestion.question,
      answer: transcript,
      category: currentQuestion.category
    }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript('');
      stopListening();
    } else {
      onEndInterview(newAnswers);
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript('');
      stopListening();
    } else {
      onEndInterview(answers);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Container className="py-4">
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Badge bg="primary">{jobTitle}</Badge>
          <span className="text-muted fw-bold">Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <ProgressBar now={progress} variant="primary" style={{ height: '10px' }} animated />
      </div>

      <Row className="gy-4">
        {/* Left Side: AI Avatar */}
        <Col lg={4} className="d-flex flex-column align-items-center justify-content-center text-center">
          <div className="position-relative mb-4">
            <motion.div
              animate={{
                scale: isSpeaking ? [1, 1.2, 1] : 1,
                rotate: isSpeaking ? [0, 5, -5, 0] : 0,
                borderRadius: isSpeaking ? ["50%", "40%", "50%"] : "50%"
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: '200px',
                height: '200px',
                background: 'linear-gradient(45deg, #0d6efd, #6610f2)',
                boxShadow: isSpeaking ? '0 0 50px rgba(13, 110, 253, 0.5)' : '0 0 20px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isSpeaking && (
                <div className="d-flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [10, 30, 10] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      style={{ width: '4px', background: 'white', borderRadius: '2px' }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="position-absolute bottom-0 end-0 bg-danger text-white rounded-circle p-2 shadow"
              >
                <MicFill size={20} />
              </motion.div>
            )}
          </div>
          <h4 className="fw-bold">{isSpeaking ? 'AI is speaking...' : isListening ? 'Listening to you...' : 'Wait...'}</h4>
        </Col>

        {/* Center/Right Side: Question & Transcript */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100 mb-4">
            <Card.Body className="p-4 d-flex flex-column">
              <div className="mb-4">
                <small className="text-uppercase text-muted fw-bold ls-1">{currentQuestion?.category}</small>
                <h3 className="fw-bold mt-2">{currentQuestion?.question}</h3>
              </div>

              <div className="flex-grow-1 bg-light rounded p-3 mb-4" style={{ minHeight: '200px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-muted small"><ChatRightTextFill className="me-1" /> Live Transcript</span>
                  <Button size="sm" variant="link" onClick={() => setShowTranscript(!showTranscript)}>
                    {showTranscript ? 'Hide' : 'Show'}
                  </Button>
                </div>
                {showTranscript && (
                  <p className="mb-0 fs-5 text-dark" style={{ lineHeight: '1.6' }}>
                    {transcript || <span className="text-muted italic">Waiting for your answer...</span>}
                  </p>
                )}
              </div>

              <div className="d-flex gap-2 flex-wrap">
                {!isListening ? (
                  <Button variant="primary" size="lg" className="px-4" onClick={startListening}>
                    <MicFill className="me-2" /> Start Answering
                  </Button>
                ) : (
                  <Button variant="danger" size="lg" className="px-4" onClick={stopListening}>
                    <StopFill className="me-2" /> Stop Recording
                  </Button>
                )}
                
                <Button variant="success" size="lg" className="px-4" onClick={handleNextQuestion} disabled={!transcript && !answers.length}>
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'} <SkipForwardFill className="ms-2" />
                </Button>

                <Button variant="outline-secondary" size="lg" onClick={handleSkip}>
                  Skip
                </Button>

                <Button variant="outline-danger" className="ms-auto" onClick={() => {
                  const finalAnswers = transcript 
                    ? [...answers, { question: currentQuestion.question, answer: transcript, category: currentQuestion.category }]
                    : answers;
                  onEndInterview(finalAnswers.length > 0 ? finalAnswers : null);
                }}>
                  <XCircleFill className="me-1" /> End Early
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InterviewPage;

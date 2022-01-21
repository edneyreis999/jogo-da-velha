import React from 'react';
import 'phaser';
import { Col, Row, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import JogoDaVelha from './game/jogo-da-velha';

const App: React.FC = () => {
  let gameJogoDaVelha: JogoDaVelha;
  const onStartGameClick = () => {
    if (!gameJogoDaVelha) {
      gameJogoDaVelha = new JogoDaVelha();
      gameJogoDaVelha.createGameInstance();
    }
  };

  return (
    <Container className="p-3">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <h1 className="header">O jogo da velha mais divertido do mundoo</h1>
      </Container>
      <Container>
        <Row className="justify-content-center">
          <Col>
            <Button variant="primary" onClick={() => onStartGameClick()}>
              Jogar
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default App;

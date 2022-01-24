import React from 'react';
import 'phaser';
import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import { GameConfig } from './config';

const App: React.FC = () => {
  return (
    <Container className="p-3">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h1 className="header" style={{ fontFamily: 'cursive' }}>
              O jogo da velha mais divertido do mundo
            </h1>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Container id="game-refactor" />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default App;

window.addEventListener('load', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const game = new Phaser.Game(GameConfig);
});

import React from 'react';
import 'phaser';
import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import JogoDaVelha from './game/game';

const App: React.FC = () => {
  return (
    <Container className="p-3">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h1 className="header">O jogo da velha mais divertido do mundo</h1>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Container id="phaser-example" />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default App;

window.addEventListener('load', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 620,
    height: 620,
    title: 'Jogo da Velha',
    backgroundColor: 0x000000,
    scene: JogoDaVelha,
  });
});

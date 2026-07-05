import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const TIMES_BASE = [
  // Espanha
  { nome: 'Villarreal', cor: '#ffe600' },
  { nome: 'Real Madrid', cor: '#FFFFFF' },
  { nome: 'Barcelona', cor: '#004D98' },
  { nome: 'Atlético Madrid', cor: '#CB3524' },
  { nome: 'Real Betis', cor: '#00ca3d' },
  { nome: 'Sevilla', cor: 'rgb(0, 81, 202)' },
  { nome: 'Real Sociedad', cor: '#076824' },
  // Inglaterra
  { nome: 'Man. City', cor: '#6CABDD' },
  { nome: 'Liverpool', cor: '#C8102E' },
  { nome: 'Man. United', cor: '#DA291C' },
  { nome: 'Arsenal', cor: '#EF0107' },
  { nome: 'Chelsea', cor: '#034694' },
  { nome: 'Tottenham', cor: '#132257' },
  { nome: 'Newcastle', cor: '#000000' },
  { nome: 'Aston Villa', cor: '#372055' },
  { nome: 'West Ham', cor: '#6c3b99' },
  { nome: 'Brighton', cor: 'rgb(0, 93, 180)' },
  { nome: 'Everton', cor: '#0048ce' },
  // Itália
  { nome: 'Juventus', cor: '#101010' },
  { nome: 'Inter de Milão', cor: '#0053A0' },
  { nome: 'Milan', cor: '#E31B23' },
  { nome: 'Roma', cor: '#8E1D34' },
  { nome: 'Napoli', cor: '#003E9A' },
  { nome: 'Bologna', cor: '#132257' },
  { nome: 'Torino', cor: '#580e0e' },
  { nome: 'Lazio', cor: '#0fa1e4' },
  { nome: 'Atalanta', cor: '#0654fa' },
  // Alemanha
  { nome: 'Bayern Munique', cor: '#DC052D' },
  { nome: 'B. Dortmund', cor: '#FDE100' },
  { nome: 'B. Leverkusen', cor: '#E32221' },
  { nome: 'Frankfurt', cor: '#ff0303' },
  { nome: 'RB Leipzig', cor: '#941e15' },
  { nome: 'Wolfsburg', cor: '#16c207' },
  // França
  { nome: 'Paris SG', cor: '#002F6C' },
  { nome: 'Marseille', cor: '#00A2E8' },
  { nome: 'Monaco', cor: '#0d3bd1' },
  { nome: 'Lyon', cor: '#132257' },
  { nome: 'Stade Rennais', cor: '#c7220c' },
  // Holanda
  { nome: 'Ajax', cor: 'rgb(88, 53, 0)' },
  { nome: 'PSV', cor: '#2c2801' },
  { nome: 'Feyenoord', cor: '#0e0303' },
  { nome: 'Almere City', cor: '#ce0808' },
  // Estados Unidos
  { nome: 'Inter Miami', cor: 'rgb(206, 96, 200)' },
  { nome: 'Orlando City', cor: '#8100bd' },
  { nome: 'LA Galaxy', cor: '#e4af00' },
  { nome: 'Austin FC', cor: 'rgb(62, 172, 47)' },
  // Arabia Saudita
  { nome: 'Al-Nassr FC', cor: '#f3c90c' },
  { nome: 'Al-Hilal SFC', cor: '#0857ce' },
  { nome: 'Al-Ittihad Club', cor: '#00865a' },
  { nome: 'Al Ahli', cor: '#0743e7' },
  // Portugal
  { nome: 'Benfica', cor: 'rgb(129, 2, 2)' },
  { nome: 'Sporting CP', cor: 'rgb(0, 139, 42)' },
  { nome: 'FC Porto', cor: '#1525bb' },
  { nome: 'SC Braga', cor: '#029765' },
  // Belgica
  { nome: 'Club Brugge', cor: 'rgb(22, 7, 231)' },
  { nome: 'Union Saint-Gilloise', cor: '#4e7718' }
];

export default function App() {
  const canvasRef = useRef(null);
  const [times, setTimes] = useState([]);
  const [angAtual, setAngAtual] = useState(0);
  const [isGirando, setIsGirando] = useState(false);
  const [vencedor, setVencedor] = useState(null);

  const qtdOpcoes = times.length;
  const arco = (2 * Math.PI) / (qtdOpcoes || 1); 


  useEffect(() => {
    reiniciarRoleta();
  }, []);


  useEffect(() => {
    if (times.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centro = canvas.width / 2;
    const raio = centro - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    times.forEach((time, i) => {
      const anguloInicial = angAtual + i * arco;
      const anguloFinal = anguloInicial + arco;

      ctx.beginPath();
      ctx.fillStyle = time.cor;
      ctx.moveTo(centro, centro);
      ctx.arc(centro, centro, raio, anguloInicial, anguloFinal);
      ctx.lineTo(centro, centro);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)'; 
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.translate(centro, centro);
      ctx.rotate(anguloInicial + arco / 2); 

      if (time.cor === '#FFFFFF' || time.cor === '#FDE100' || time.cor === '#ffe600') {
        ctx.fillStyle = '#000000';
      } else {
        ctx.fillStyle = '#FFFFFF';
      }
      
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'right'; 
      ctx.fillText(time.nome, raio * 0.93, 3);
      ctx.restore();
    });
  }, [angAtual, arco, qtdOpcoes, times]);


  const girarRoleta = () => {
    if (isGirando || times.length === 0) return;

    setIsGirando(true);
    setVencedor(null);

    const voltasExtras = Math.floor(Math.random() * 6) + 6; 
    const anguloAlvo = angAtual + voltasExtras * 2 * Math.PI + Math.random() * 2 * Math.PI;
    
    let inicio = null;
    const duracao = 5000; 

    const animar = (timestamp) => {
      if (!inicio) inicio = timestamp;
      const progresso = timestamp - inicio;
      
      const t = Math.min(progresso / duracao, 1);
      const easeOut = 1 - Math.pow(1 - t, 4); 

      const anguloFrame = angAtual + (anguloAlvo - angAtual) * easeOut;
      setAngAtual(anguloFrame % (2 * Math.PI));

      if (progresso < duracao) {
        requestAnimationFrame(animar);
      } else {
        setIsGirando(false);
        calcularVencedor(anguloFrame);
      }
    };

    requestAnimationFrame(animar);
  };


  const calcularVencedor = (anguloFinal) => {
    const anguloPonteiro = (3 * Math.PI) / 2; 
    let anguloNormalizado = (anguloPonteiro - anguloFinal) % (2 * Math.PI);
    if (anguloNormalizado < 0) anguloNormalizado += 2 * Math.PI;

    const indiceVencedor = Math.floor(anguloNormalizado / arco) % qtdOpcoes;
    setVencedor(times[indiceVencedor]);
  };


  const removerTimeVencedor = () => {
    if (!vencedor) return;
    const novaLista = times.filter((t) => t.nome !== vencedor.nome);
    setTimes(novaLista);
    setVencedor(null);
    setAngAtual(0); 
  };


  const reiniciarRoleta = () => {
    if (isGirando) return;
    const timesEmbaralhados = [...TIMES_BASE].sort(() => Math.random() - 0.5);
    setTimes(timesEmbaralhados);
    setVencedor(null);
    setAngAtual(0);
  };

  return (
    <div className="layout-roleta">
      <h1>Roleta de Times</h1>
      
      <div className="roleta-wrapper">
        <div className="ponteiro"></div> 
        <canvas ref={canvasRef} width={500} height={500} />
      </div>

      <div className="botoes-container">

        <button className="botao-grid botao-girar" onClick={girarRoleta} disabled={isGirando}>
          {isGirando ? 'Girando...' : 'GIRAR!'}
        </button>


        <button className="botao-grid botao-reiniciar" onClick={reiniciarRoleta} disabled={isGirando}>
          Reiniciar Roleta
        </button>
      </div>


      {vencedor && (
        <div className="resultado-box">
          <h2>⚽ Time Sorteado ⚽</h2>
          <p>{vencedor.nome}</p>
          <button className="botao-esconder" onClick={removerTimeVencedor}>
            Esconder este time da roleta
          </button>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import Barcode from 'react-barcode';
import './App.css';

function App() {
  const [availableSpots, setAvailableSpots] = useState(30);
  const [reservations, setReservations] = useState([]);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showReservations, setShowReservations] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [spotId, setSpotId] = useState('');

  useEffect(() => {
    const savedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
    setReservations(savedReservations);
    setAvailableSpots(30 - savedReservations.length);
  }, []);

  const handleReserveSpot = () => {
    if (!ownerName.trim() || !carModel.trim() || !licensePlate.trim()) {
      alert('Todos os campos são obrigatórios! Por favor, preencha todos.');
      return;
    }

    const newReservation = {
      id: Date.now().toString(),
      ownerName,
      carModel,
      licensePlate,
    };

    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    setAvailableSpots(availableSpots - 1);
    setOwnerName('');
    setCarModel('');
    setLicensePlate('');
    setShowReservationForm(false);
    alert('Reserva criada com sucesso!');
  };

  const handleCancelReservation = () => {
    const trimmedSpotId = spotId.trim();
    const updatedReservations = reservations.filter(reservation => reservation.id !== trimmedSpotId);

    if (updatedReservations.length !== reservations.length) {
      setReservations(updatedReservations);
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setAvailableSpots(availableSpots + 1);
      setSpotId('');
      setShowCancelForm(false);
      alert('Vaga liberada com sucesso!');
    } else {
      alert('ID da vaga não encontrado.');
    }
  };

  return (
    <div className="App">
      <h1>Estacionamento Inteligente</h1>
      <div className="counter">
        <h2>{availableSpots} vagas disponíveis</h2>
      </div>
      <div className="buttons">
        <button className="btn btn-primary" onClick={() => setShowReservationForm(true)}>Reservar Vaga</button>
        <button className="btn btn-secondary" onClick={() => setShowCancelForm(true)}>Cancelar Reserva</button>
        <button className="btn btn-info" onClick={() => setShowReservations(true)}>Visualizar Reservas</button>
      </div>

      {showReservationForm && (
        <div className="modal">
          <h2>Reservar Vaga</h2>
          <input
            type="text"
            placeholder="Nome do proprietário"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Modelo do carro"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
          />
          <input
            type="text"
            placeholder="Placa do carro"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleReserveSpot}>Confirmar</button>
          <button className="btn btn-danger" onClick={() => setShowReservationForm(false)}>Cancelar</button>
        </div>
      )}

      {showCancelForm && (
        <div className="modal">
          <h2>Cancelar Reserva</h2>
          <input
            type="text"
            placeholder="ID da vaga"
            value={spotId}
            onChange={(e) => setSpotId(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleCancelReservation}>Confirmar</button>
          <button className="btn btn-danger" onClick={() => setShowCancelForm(false)}>Cancelar</button>
        </div>
      )}

      {showReservations && (
        <div className="modal">
          <h2>Vagas Reservadas</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID da Vaga</th>
                <th>Nome do Proprietário</th>
                <th>Modelo do Carro</th>
                <th>Placa do Carro</th>
                <th>Código de Barras</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.ownerName}</td>
                  <td>{reservation.carModel}</td>
                  <td>{reservation.licensePlate}</td>
                  <td>
                    <Barcode value={reservation.id} width={1} height={50} displayValue={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-danger" onClick={() => setShowReservations(false)}>Fechar</button>
        </div>
      )}
    </div>
  );
}

export default App;
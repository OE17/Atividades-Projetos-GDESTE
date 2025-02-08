import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

function App() {
  // registrations now represent people present inside the location.
  const [registrations, setRegistrations] = useState([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);

  // Form fields for a person
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [cancelId, setCancelId] = useState('');

  // When the app mounts, get the registrations from localStorage
  useEffect(() => {
    const savedRegistrations = JSON.parse(localStorage.getItem('registrations')) || [];
    setRegistrations(savedRegistrations);
  }, []);

  // Function to generate a random 14-digit ID
  const generateRandomId = () => {
    let id = '';
    for (let i = 0; i < 14; i++) {
      id += Math.floor(Math.random() * 10);
    }
    return id;
  };

  // Function to handle registration of a person
  const handleRegister = () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !cpf.trim()) {
      alert('Todos os campos são obrigatórios! Por favor, preencha todos.');
      return;
    }

    // Check if CPF is already registered (each registration should be unique)
    const isDuplicateCpf = registrations.some(
      registration => registration.cpf.trim() === cpf.trim()
    );
    if (isDuplicateCpf) {
      alert('Este CPF já está registrado! Cada pessoa deve ter um CPF único.');
      return;
    }

    const newRegistration = {
      id: generateRandomId(),
      name,
      phone,
      email,
      cpf,
    };

    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));

    setName('');
    setPhone('');
    setEmail('');
    setCpf('');
    setShowRegistrationForm(false);
    alert('Cadastro realizado com sucesso!');
  };

  // Function to handle cancellation of a registration by ID
  const handleCancelRegistration = () => {
    const trimmedId = cancelId.trim();
    const updatedRegistrations = registrations.filter(
      registration => registration.id !== trimmedId
    );

    if (updatedRegistrations.length !== registrations.length) {
      setRegistrations(updatedRegistrations);
      localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
      setCancelId('');
      setShowCancelForm(false);
      alert('Registro cancelado com sucesso!');
    } else {
      alert('ID não encontrado.');
    }
  };

  return (
    <div className="App">
      <h1>Monitoramento de Acesso</h1>
      <div className="counter">
        <h2>O número atual de pessoas dentro do local é {registrations.length}</h2>
      </div>
      <div className="buttons">
        <button className="btn btn-primary" onClick={() => setShowRegistrationForm(true)}>
          Registrar Entrada
        </button>
        <button className="btn btn-secondary" onClick={() => setShowCancelForm(true)}>
          Cancelar Entrada
        </button>
        <button className="btn btn-info" onClick={() => setShowRegistrations(true)}>
          Visualizar Registros
        </button>
      </div>

      {showRegistrationForm && (
        <div className="modal">
          <h2>Registrar Entrada</h2>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleRegister}>
            Confirmar
          </button>
          <button className="btn btn-danger" onClick={() => setShowRegistrationForm(false)}>
            Cancelar
          </button>
        </div>
      )}

      {showCancelForm && (
        <div className="modal">
          <h2>Cancelar Entrada</h2>
          <input
            type="text"
            placeholder="Digite o ID do registro"
            value={cancelId}
            onChange={(e) => setCancelId(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleCancelRegistration}>
            Confirmar
          </button>
          <button className="btn btn-danger" onClick={() => setShowCancelForm(false)}>
            Cancelar
          </button>
        </div>
      )}

      {showRegistrations && (
        <div className="modal">
          <h2>Pessoas Registradas</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>CPF</th>
                <th>QR Code</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id}>
                  <td>{registration.id}</td>
                  <td>{registration.name}</td>
                  <td>{registration.phone}</td>
                  <td>{registration.email}</td>
                  <td>{registration.cpf}</td>
                  <td>
                    <QRCodeSVG value={registration.id} size={50} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-danger" onClick={() => setShowRegistrations(false)}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
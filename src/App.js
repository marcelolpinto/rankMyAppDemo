import React, { Component } from 'react';
import axios from 'axios';
import cron from 'node-cron'; 

import AlertCard from './AlertCard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      email: '',
      frequency: '2',

      validationError: '',

      updating: null,

      searchUpdate: '',
      emailUpdate: '',
      frequencyUpdate: '',

      alerts: []
    };

    this.renderAlerts = this.renderAlerts.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handlePostSubmit = this.handlePostSubmit.bind(this);
    this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    this.handleUpdateToggle = this.handleUpdateToggle.bind(this);

    this.intervals = {};
  }

  async componentWillMount() {
    const response = await axios.get('/api'),
      { alerts } = response.data;


    if(alerts.length) this.setState({ alerts });
  }

  componentDidUpdate() {
    let { alerts } = this.state;

    for(let a of alerts) {
      if(!this.intervals[a._id]) { 
        this.intervals[a._id] = cron.schedule(`*/${a.frequency} * * * *`, () => {
          this.handleEmailSubmit(a);
        });;
        this.intervals[a._id].start();
      }
    }

    for(let i in this.intervals) {
      let index = alerts.findIndex(a => a._id === i);
      if(index === -1) {
        this.intervals[i].destroy();
        delete this.intervals[i];
      }
    }
  }

  handleChange(e) {
    const { id, value } = e.target;
    this.setState({ [id]: value, validationError: '' });
  }


  handleRadioChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value, validationError: '' })
  }

  handleUpdateToggle(item) {
    let { updating } = this.state, { _id, search, email, frequency } = item;

    let searchUpdate = '',
      emailUpdate = '',
      frequencyUpdate = '';

    if(_id === updating) return this.setState({ updating: null, searchUpdate, emailUpdate, frequencyUpdate });

    searchUpdate = search;
    emailUpdate = email;
    frequencyUpdate = frequency;

    this.setState({ updating: _id, searchUpdate, emailUpdate, frequencyUpdate });
  }

  renderAlerts() {
    const { alerts, updating, searchUpdate, emailUpdate, frequencyUpdate } = this.state;

    if(!alerts.length) return <div className='empty'>Não existem alertas cadastrados.</div>;

    return alerts.map(a => <AlertCard
      item={a}
      key={a._id}
      updating={updating === a._id}
      searchUpdate={searchUpdate}
      emailUpdate={emailUpdate}
      frequencyUpdate={frequencyUpdate}
      changeAction={this.handleChange}
      changeRadioAction={this.handleRadioChange}
      toggleAction={this.handleUpdateToggle}
      updateAction={this.handleUpdateSubmit}
      deleteAction={this.handleDeleteSubmit}
    />);
  }

  render() {
    const { search, email, frequency, validationError, updating } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <div className='half-section'>
            <h2>Criar Alerta</h2>
            <p>Selecione a busca do eBay, o email para quem enviar e a frequência desejada para criar um alerta.</p>
            <div className='input-group'>
              <label htmlFor='search'>Busca</label>
              <input disabled={updating} type='text' id='search' onChange={this.handleChange} value={search} />
            </div>
            <div className='input-group'>
              <label htmlFor='email'>Email</label>
              <input disabled={updating} type='text' id='email' onChange={this.handleChange} value={email} />
            </div>
            <div className='input-group' onChange={this.handleRadioChange}>
              <label>Frequência </label>
              <div className='radio-wrapper'>
                <input type="radio" value='2' name="frequency" checked={frequency === '2'}/>
                <label className='radio'>A cada 2 minutos</label>
              </div>
              <div className='radio-wrapper'>
                <input type="radio" value='10' name="frequency" checked={frequency === '10'}/>
                <label className='radio'>A cada 10 minutos</label>
              </div>
              <div className='radio-wrapper'>
                <input type="radio" value='30' name="frequency" checked={frequency === '30'}/>
                <label className='radio'>A cada 30 minutos</label>
              </div>
            </div>
            <button className='create' onClick={this.handlePostSubmit} disabled={!search || !email || !frequency || updating} >
              Criar Alerta
            </button>
            <div className='error'>{validationError}</div>
          </div>
          <div className='half-section -right'>
            <h2>Meus Alertas</h2>
            {this.renderAlerts()}
          </div>
        </header>
      </div>
    );
  }

  handlePostSubmit() {
    const { search, email, frequency } = this.state,
      body = { search, email, frequency },
      formData = new FormData();
    let { alerts } = this.state;

    for(let a of alerts) {
      if(a.search === search && a.email === email)
        return this.setState({ validationError: 'Não é permitido cadastrar um alerta com mesma busca e mesmo email.' });
    }

    for(var key in body) {
      formData.append(key, body[key]);
    }

    axios({
      method: 'post',
      url: '/api',
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    }).then(res => {
      alerts.push(res.data.alert);
      this.setState({ alerts, search: '', email: '', frequency: '2' });
    }).catch(err => {
      console.log('post error', err);
    });
  }

  handleDeleteSubmit(item) {
    const { _id } = item;
    let { alerts } = this.state;

    axios.delete(`/api/${_id}`)
      .then(res => {
        const index = alerts.findIndex(a => a._id === _id);
        if(index !== -1) alerts.splice(index, 1);

        this.setState({ alerts });
      })
      .catch(err => {
        console.log('delete error', err);
      });
  }

  async handleUpdateSubmit(item) {
    const { searchUpdate, emailUpdate, frequencyUpdate } = this.state,
      formData = new FormData(),
      { _id } = item;
    let { alerts } = this.state;

    formData.append('search', searchUpdate);
    formData.append('email', emailUpdate);
    formData.append('frequency', frequencyUpdate);
    formData.append('id', _id);


    axios({
      method: 'put',
      url: '/api',
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    }).then(res => {
      const index = alerts.findIndex(a => a._id === _id);
      if(index !== -1) alerts.splice(index, 1, res.data.alert);

      this.intervals[_id].destroy();
      delete this.intervals[_id];
      this.setState({ alerts, updating: null });
    }).catch(err => {
      console.log('update error', err);
    });
  }

  handleEmailSubmit(alert) {
    const { search, email } = alert, formData = new FormData();

    formData.append('search', search);
    formData.append('email', email);

   axios({
      method: 'post',
      url: '/api/email',
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    }).then(res => {
      console.log('mail sent to ' + email);
    }).catch(err => {
      console.log('update error', err);
    }); 
  }
}

export default App;
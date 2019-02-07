import React from 'react';

const AlertCard = ({ item, updateAction, deleteAction, changeAction, changeRadioAction, toggleAction, updating, searchUpdate, emailUpdate, frequencyUpdate }) => {
	return (
		<div className='alert-card'>
			<div className='left-section'>
				<div>
					<b>Busca:</b>
					{
						!updating ? item.search :
						<input id='searchUpdate' onChange={changeAction} value={searchUpdate} />
					}
				</div>
				<div>
					<b>Email:</b>
					{
						!updating ? item.email :
						<input id='emailUpdate' onChange={changeAction} value={emailUpdate} />
					}
				</div>
				<div><b>Frequência:</b>
					{
						!updating ? `A cada ${item.frequency} minutos` :
						<div className='input-group' onChange={changeRadioAction}>
							<div className='radio-wrapper' key={1}>
	              <input type="radio" value='2' name="frequencyUpdate" checked={frequencyUpdate === '2'}/>
	              <label className='radio'>A cada 2 minutos</label>
	            </div>
	            <div className='radio-wrapper' key={2}>
	              <input type="radio" value='10' name="frequencyUpdate" checked={frequencyUpdate === '10'}/>
	              <label className='radio'>A cada 10 minutos</label>
	            </div>
	            <div className='radio-wrapper' key={3}>
	              <input type="radio" value='30' name="frequencyUpdate" checked={frequencyUpdate === '30'}/>
	              <label className='radio'>A cada 30 minutos</label>
	            </div>
					</div>
					}
				</div>

			</div>
			<div className='right-section'>
				<div className='action' onClick={() => toggleAction(item)}>{!updating ? 'Editar' : 'Cancelar'}</div>
				<div className='action' onClick={() => !updating ? deleteAction(item) : updateAction(item)}>{!updating ? 'Deletar' : 'Salvar'}</div>
			</div>
		</div>
	);
}

export default AlertCard;
import { useReducer, useState } from 'react';
import './App.css';

const Status = {
  Open: 0,
  Closed: 1,
}

const Type = {
  Open: 'OPEN',
  Close: 'CLOSE',
  Delete: 'DELETE',
}

const reducer = (state, action) => {
  switch (action.type) {
    case Type.Open:
      {
        const newId = ((state.map(x => x.id).sort((a, b) => b - a)[0]) || 0) + 1;
        const newItem = { id: newId, ...action };
        const newState = [...state, newItem];
        return newState.sort((a, b) => a.id - b.id);
      };
    case Type.Close:
      {
        console.log('state',state);
        const newState = state.filter(x => x.id !== action.id);
        console.log('1 newState',newState);
        newState.push(action);
        console.log('2 newState',newState);
        return newState.sort((a, b) => a.id - b.id);
      };
    case Type.Delete:
      {
        const newState = state.filter(x => x.id !== action.id);
        return newState.sort((a, b) => a.id - b.id);
      };
    default:
      return state;
  }
}

function App() {
  const [option, setOption] = useState(Status.Open);
  const [newTask, setNewTak] = useState({
    status: Status.Open,
    text: ''
  });

  const [state, dispatch] = useReducer(reducer, []);

  const addItem = _ => {
    const item = newTask;
    dispatch({ ...item, type: Type.Open });

    setNewTak({
      status: Status.Open,
      text: ''
    });
  }

  const closeItem = item => {
    dispatch({ ...item, status:Status.Closed, type: Type.Close });
  }
  const deleteItem = item => {
    dispatch({ ...item, type: Type.Delete });
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-Content">
          Todo List
          <br />
          <br />
          <div className='App-row'>
            <input className='App-input' value={newTask.text} onChange={e => setNewTak({ ...newTask, text: e.target.value })} />
            &nbsp;
            <button className='App-button-add' onClick={addItem}>Add</button>
          </div>
          <br />
          <ButtonGroup option={option} _handleSetOption={setOption} />
          <br />
          <ListTodo items={state} option={option} _handleClose={item => closeItem(item)} _handleDelete={item => deleteItem(item)} />
        </div>
      </header>
    </div>
  );
}

const ButtonGroup = ({ option, _handleSetOption }) => {
  return (
    <div className='App-row'>
      <button onClick={_ => _handleSetOption(Status.Open)} style={{ color: option === Status.Open ? '#6495ED' : '#333' }} className='App-Button'>Open</button>
      &nbsp;
      <button onClick={_ => _handleSetOption(Status.Closed)} style={{ color: option === Status.Closed ? '#6495ED' : '#333' }} className='App-Button'>Closed</button>
    </div>
  );
}

const ListTodo = ({ items,option, _handleClose, _handleDelete }) => {
  return (
    <div className='App-list'>
      {ValidNull(items) && items.filter(x => x.status === option).map(item =>
        <div className='App-list-item'>
          {item.text}
          <div>
          {item.status === Status.Open && <><button onClick={_ => _handleClose(item)} className='App-button-action' style={{backgroundColor:'#228B22'}}>Close</button>&nbsp;<button onClick={_ => _handleDelete(item)} className='App-button-action' style={{backgroundColor:'#B22222'}}>Delete</button></>}          
          {item.status === Status.Closed && <button onClick={_ => _handleDelete(item)} className='App-button-action' style={{backgroundColor:'#B22222'}}>Delete</button>}
          </div>
        </div>
      )}
    </div>
  )
}


function ValidNull(obj) {
  try {
    if (obj !== undefined && obj !== null && obj !== "" && obj !== {} && obj !== [])
      return true;
    return false;
  } catch {
    return false;
  }
}

export default App;

import flatpickr from 'flatpickr';
import { useEffect, useState } from 'react';

export default function Create() {
  const [vehicleType, setVehicleType] = useState<string>();
  const [enteredAt, setEnter] = useState<Date>();
  const [exitedAt, setExit] = useState<Date>();
  const [errMsg, setErrMsg] = useState('');
  const [price, setPrice] = useState<number>()
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    flatpickr("#enterDate", {
      enableTime: true,
      time_24hr: true,
      onChange: function(selectedDates, dateStr, instance) {
        setEnter(selectedDates[0])
      }
    });

    flatpickr("#exitDate", {
      enableTime: true,
      time_24hr: true,
      onChange: function(selectedDates, dateStr, instance) {
        setExit(selectedDates[0])
      }
    });
  }, [])

  function save() {
    setErrMsg('')
    setPrice(undefined)
    setLoading(true)
    fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vehicleType,
        enteredAt: enteredAt?.toISOString(),
        exitedAt: exitedAt?.toISOString(),
      })
    }).then((response) => {
      if (!response.ok) {
        response.text()
          .then((t)=> JSON.parse(t))
          .then((data) => setErrMsg(data.message))
      } else {
        response.json()
          .then((data) => setPrice(data.price));
      }
    })
    .catch((e) => console.log(e))
    .finally(() => setLoading(false));
  }

  return (
    <div className='container' style={{ maxWidth: '1000px' }}>
      <div className='row text-center' style={{ marginTop: '60px' }}>
        <h3>Create Log</h3>
      </div>
      <div className="row justify-content-center" style={{ marginTop: '20px' }}>
        <div className="mb-3" style={{ maxWidth: '500px' }}>
          <label className="form-label">Type</label>
          <select className="form-select" onChange={(event) => setVehicleType(event.target.value)}>
            <option value="">-- All --</option>
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
          </select>
        </div>
      </div>
      <div className="row justify-content-center" style={{ marginTop: '20px' }}>
        <div className="mb-3" style={{ maxWidth: '500px' }}>
          <label className="form-label">Enter Date</label>
          <input id="enterDate" type="text" placeholder="Select date ..." className="form-control" />
        </div>
      </div>
      <div className="row justify-content-center" style={{ marginTop: '20px' }}>
        <div className="mb-3" style={{ maxWidth: '500px' }}>
          <label className="form-label">Exit Date</label>
          <input id="exitDate" type="text" placeholder="Select date ..." className="form-control" />
        </div>
      </div>
      <div className="row justify-content-center" style={{ marginTop: '20px' }}>
        <button className="btn btn-success" disabled={isLoading} style={{ maxWidth: '140px' }}
          onClick={save}>Save</button>
      </div>
      <div className="row justify-content-center text-center" style={{ marginTop: '20px' }}>
        {errMsg && (
          <div className="alert alert-danger" style={{ maxWidth: '500px' }} role="alert">
            {errMsg}
          </div>
        )}
        {price && (
          <div className="alert alert-success" style={{ maxWidth: '500px' }} role="alert">
            Data recorded successfully <br />Price: <strong>{price}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
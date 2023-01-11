import moment from 'moment';
import { useEffect, useState } from 'react'
import flatpickr from 'flatpickr';
import { URLSearchParams } from 'next/dist/compiled/@edge-runtime/primitives/url';
import Link from 'next/link';

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);
  const [vehicleType, setVehicleType] = useState<string>();
  const [minDate, setMinDate] = useState<Date>();
  const [maxDate, setMaxDate] = useState<Date>();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    search();
  }, [])

  useEffect(() => {
    flatpickr("#minDate", {
      enableTime: true,
      time_24hr: true,
      onChange: function(selectedDates, dateStr, instance) {
        setMinDate(selectedDates[0])
      }
    });

    flatpickr("#maxDate", {
      enableTime: true,
      time_24hr: true,
      onChange: function(selectedDates, dateStr, instance) {
        setMaxDate(selectedDates[0])
      }
    });
  }, [])

  function search() {
    const queryparams = new URLSearchParams();
    queryparams.append('vehicleType', vehicleType || '');
    queryparams.append('minEnterDate', minDate ? minDate.toISOString() : '');
    queryparams.append('maxEnterDate', maxDate ? maxDate.toISOString() : '');
    queryparams.append('minPrice', minPrice || '');
    queryparams.append('maxPrice', maxPrice || '');

    fetch('/api/logs?' + queryparams.toString())
      .then((response) => response.json())
      .then((data) => setLogs(data))
      .catch((e) => console.log(e));
  }

  return (
    <div className='container' style={{ maxWidth: '1000px' }}>
      <div className='row text-center' style={{ marginTop: '60px' }}>
        <h3>Log Data <Link href="/create"><button className="btn btn-success btn-sm">+ Create</button></Link></h3>
      </div>
      <div className="row" style={{ marginTop: '20px' }}>
        <div className="col-2">
          <div className="mb-3">
            <label className="form-label">Type</label>
            <select className="form-select form-select-sm" onChange={(event) => setVehicleType(event.target.value)}>
              <option value="">-- All --</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>
        </div>
        <div className="col-2">
          <div className="mb-3">
            <label className="form-label">Min Date</label>
            <input id="minDate" type="text" placeholder="Select date ..." className="form-control form-control-sm" />
          </div>
        </div>
        <div className="col-2">
          <div className="mb-3">
            <label className="form-label">Max Date</label>
            <input id="maxDate" type="text" placeholder="Select date ..." className="form-control form-control-sm" />
          </div>
        </div>
        <div className="col-2">
          <div className="mb-3">
            <label className="form-label">Min Price</label>
            <input type="text" value={minPrice} placeholder="ex: 8000 ..." className="form-control form-control-sm" 
              onChange={(e) => {
                const newValue = e.target.value;
                if (!isNaN(+newValue)) {
                  setMinPrice(newValue);
                }
              }} />
          </div>
        </div>
        <div className="col-2">
          <div className="mb-3">
            <label className="form-label">Max Price</label>
            <input value={maxPrice} type="text" placeholder="ex: 8000 ..." className="form-control form-control-sm"
              onChange={(e) => {
                const newValue = e.target.value;
                if (!isNaN(+newValue)) {
                  setMaxPrice(newValue);
                }
              }} />
          </div>
        </div>
        <div className="col-2 d-flex align-items-center justify-content-center">
          <button className="btn btn-info" onClick={search}>Search</button>
        </div>
      </div>
      <div className='row justify-content-center' style={{ marginTop: '20px' }}>
        <table className="table text-center">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Enter</th>
              <th scope="col">Exit</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={{ textTransform: 'capitalize' }}>{log.vehicleType}</td>
                <td>{moment(log.enteredAt).format('YYYY-MM-DD hh:mm:ss')}</td>
                <td>{moment(log.exitedAt).format('YYYY-MM-DD hh:mm:ss')}</td>
                <td>{log.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="alert alert-warning text-center" role="alert">
            No data found.
          </div>
        )}
      </div>
    </div>
  )
}
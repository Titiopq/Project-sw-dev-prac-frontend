import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

interface BookingForm {
  exhibition: string;
  boothType: string;
  amount: number;
}

interface Exhibition {
  _id: string;
  name: string;
}

export default function BookingFormPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [form, setForm] = useState<BookingForm>({
    exhibition: "",
    boothType: "small",
    amount: 1,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({
      ...form,
      [e.target.name]: e.target.name === 'amount' ? Number(e.target.value) : e.target.value,
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic client-side validation
    if (!form.exhibition) {
      alert('Please select an exhibition');
      return;
    }
    if (!['small', 'big'].includes(form.boothType)) {
      alert('Invalid booth type');
      return;
    }
    if (!Number.isFinite(form.amount) || form.amount < 1 || form.amount > 6) {
      alert('Amount must be a number between 1 and 6');
      return;
    }

    try {
      if (id) await api.put(`/booking/${id}`, form);
      else await api.post('/booking', form);
      navigate('/bookings');
    } catch (err: any) {
      console.error('Booking error', err);
      const msg = err.response?.data?.message || err.message || 'Booking failed';
      alert(msg);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await api.get("/exhibitions");
      setExhibitions(res.data.data || res.data);
    })();
    if (id) api.get(`/booking/${id}`).then((res) => {
      const d = res.data.data;
      setForm({
        exhibition: d.exhibition?._id || d.exhibition,
        boothType: d.boothType,
        amount: d.amount,
      });
    });
  }, [id]);

  return (
    <div className="app-container">
      <div className="card form-card">
        <h2 className="page-title">{id ? "Edit Booking" : "New Booking"}</h2>

        <form onSubmit={submit}>
          <div className="form-row">
            <label htmlFor="exhibition">Exhibition</label>
            <select id="exhibition" className="form-input" name="exhibition" value={form.exhibition} onChange={change}>
              <option value="">Select Exhibition</option>
              {exhibitions.map((e) => (
                <option key={e._id} value={e._id}>{e.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="boothType">Booth Type</label>
            <select id="boothType" className="form-input" name="boothType" value={form.boothType} onChange={change}>
              <option value="small">Small</option>
              <option value="big">Big</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="amount">Amount</label>
            <input id="amount" className="form-input" type="number" min={1} max={6} name="amount" value={form.amount} onChange={change} />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">{id ? "Save Booking" : "Create Booking"}</button>
          </div>
        </form>

        <p className="form-help" style={{ marginTop: 12 }}>* Backend limit: Max 6 booths total</p>
      </div>
    </div>
  );
}

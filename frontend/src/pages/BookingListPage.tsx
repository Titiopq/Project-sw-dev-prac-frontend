import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/AuthContext";

interface Booking {
  _id: string;
  boothType: string;
  amount: number;
  user?: any;
  exhibition?: any;
}

export default function BookingListPage() {
  const { isMember, isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = async () => {
    const res = await api.get("/booking");
    setBookings(res.data.data || res.data);
  };

  const remove = async (id: string) => {
    if (confirm("Delete booking?")) {
      await api.delete(`/booking/${id}`);
      load();
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="page-title">Bookings</h2>
        {isMember && (
          <Link to="/bookings/new" className="btn btn-primary">+ New Booking</Link>
        )}
      </div>

      <div className="list">
        {bookings.map((b) => (
          <div key={b._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{b.exhibition?.name}</h3>
                <p className="muted" style={{ margin: '0.4rem 0' }}>{b.exhibition?.venue}</p>
                <p style={{ margin: '0.25rem 0' }}>Booth: <b>{b.boothType}</b> • Amount: {b.amount}</p>
                {isAdmin && <p className="muted" style={{ marginTop: 6 }}>User: {b.user?.email}</p>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 12 }}>
                <Link to={`/bookings/${b._id}/edit`} className="btn btn-outline">Edit</Link>
                <button className="btn btn-outline" onClick={() => remove(b._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

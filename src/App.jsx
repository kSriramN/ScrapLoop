import React, { useEffect, useMemo, useState } from "react";
import {
  Recycle, UserRound, ClipboardList, Bike, MapPin, Camera, ImagePlus,
  Navigation, CheckCircle2, Clock3, PackageCheck, Receipt, RotateCcw,
  Phone, CalendarDays, ArrowRight, IndianRupee, LocateFixed, FileText
} from "lucide-react";

const initialOrder = {
  id: "SCR-1001", customer: "Ananya Rao", phone: "98765 43210",
  scrap: "Old newspapers", estimate: "10", address: "Madhapur, Hyderabad",
  landmark: "Near Metro Pillar ಾಚ", photo: "", collector: "Ramesh",
  weight: "8", rate: "15", amount: "120", paymentMode: "UPI",
  remarks: "", status: "New request", created: new Date().toLocaleDateString("en-IN")
};

const scrapTypes = ["Old newspapers", "Cardboard", "Plastic", "Iron / Steel", "Aluminium", "E-waste", "Mixed scrap"];
const rates = { "Old newspapers": 15, "Cardboard": 8, "Plastic": 12, "Iron / Steel": 28, "Aluminium": 95, "E-waste": 20, "Mixed scrap": 10 };

function App() {
  const [role, setRole] = useState("Customer");
  const [order, setOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem("scraploop-order")) || initialOrder; }
    catch { return initialOrder; }
  });
  const [photoPreview, setPhotoPreview] = useState(order.photo || "");
  const [toast, setToast] = useState("");
  const [invoiceVisible, setInvoiceVisible] = useState(false);

  useEffect(() => { localStorage.setItem("scraploop-order", JSON.stringify(order)); }, [order]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const update = (key, value) => setOrder(prev => ({ ...prev, [key]: value }));
  const amount = useMemo(() => {
    const calculated = Number(order.weight || 0) * Number(order.rate || 0);
    return Number.isFinite(calculated) ? calculated : 0;
  }, [order.weight, order.rate]);

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setToast("Please select an image file."); return; }
    if (file.size > 4 * 1024 * 1024) { setToast("Please choose an image under 4 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      update("photo", reader.result);
    };
    reader.readAsDataURL(file);
  }

  function useLocation() {
    if (!navigator.geolocation) { setToast("Location is not supported by this browser."); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
        update("address", `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
        update("mapUrl", url);
        setToast("Current location added.");
      },
      () => setToast("Could not get location. Please enter the address manually."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function openMaps() {
    const destination = order.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address + ", " + order.landmark)}`;
    window.open(destination, "_blank", "noopener,noreferrer");
  }

  function resetDemo() {
    const fresh = { ...initialOrder, created: new Date().toLocaleDateString("en-IN") };
    setOrder(fresh); setPhotoPreview(""); setInvoiceVisible(false); setRole("Customer");
    localStorage.removeItem("scraploop-order"); setToast("Demo data reset.");
  }

  function submitRequest(e) {
    e.preventDefault();
    update("status", "New request");
    setToast("Scrap collection request submitted.");
  }

  function assignPickup(e) {
    e.preventDefault();
    update("status", "Pickup assigned");
    setToast(`Pickup assigned to ${order.collector}.`);
  }

  function completePickup(e) {
    e.preventDefault();
    update("amount", String(amount));
    update("status", "Completed");
    setInvoiceVisible(true);
    setToast("Collection completed and invoice generated.");
  }

  const completed = order.status === "Completed";
  const assigned = order.status === "Pickup assigned" || completed;
  const steps = [
    { label: "Request", done: order.status !== "Draft" },
    { label: "Assign", done: assigned },
    { label: "Collect", done: completed },
    { label: "Invoice", done: completed }
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={e => e.preventDefault()}>
          <span className="brand-icon"><Recycle size={23} /></span>
          <span><strong>ScrapLoop</strong><small>Local scrap collection</small></span>
        </a>
        <div className="top-actions">
          <span className="demo-pill">POC DEMO</span>
          <button className="reset-btn" onClick={resetDemo}><RotateCcw size={15}/> Reset demo</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <div className="eyebrow">A cleaner neighbourhood starts here</div>
            <h1>Scrap collection,<br/><span>made simple.</span></h1>
            <p>Request a pickup, track the collection and receive a clear payment receipt — all in one place.</p>
          </div>
          <div className="hero-art"><div className="art-circle"><Recycle size={74}/></div><span className="art-leaf leaf-one">✦</span><span className="art-leaf leaf-two">✳</span></div>
        </section>

        <section className="workflow-card">
          <div className="workflow-heading"><div><strong>Collection journey</strong><small>Order {order.id}</small></div><Status status={order.status}/></div>
          <div className="steps">
            {steps.map((step, i) => <div className={`step ${step.done ? "done" : ""}`} key={step.label}>
              <div className="step-line"><span>{step.done ? <CheckCircle2 size={17}/> : i + 1}</span></div>
              <small>{step.label}</small>
            </div>)}
          </div>
        </section>

        <section className="role-section">
          <div className="section-title"><div><span className="eyebrow">DEMO WORKSPACE</span><h2>Choose your role</h2></div><span className="role-hint">Switch roles to test the full flow</span></div>
          <div className="role-tabs">
            {[
              { name: "Customer", icon: UserRound, desc: "Create request" },
              { name: "Admin", icon: ClipboardList, desc: "Manage orders" },
              { name: "Pickup Boy", icon: Bike, desc: "Collect scrap" }
            ].map(({ name, icon: Icon, desc }) => <button key={name} onClick={() => setRole(name)} className={`role-tab ${role === name ? "active" : ""}`}>
              <Icon size={19}/><span><b>{name}</b><small>{desc}</small></span>
            </button>)}
          </div>
        </section>

        {role === "Customer" && <section className="panel">
          <PanelHeader icon={<UserRound/>} title="Create a pickup request" subtitle="Tell us what you'd like us to collect."/>
          <form onSubmit={submitRequest} className="form-grid">
            <Field label="Your name"><input required value={order.customer} onChange={e => update("customer", e.target.value)} placeholder="Enter your name"/></Field>
            <Field label="Mobile number"><input value={order.phone} onChange={e => update("phone", e.target.value)} placeholder="Enter mobile number"/></Field>
            <Field label="Type of scrap"><select value={order.scrap} onChange={e => { update("scrap", e.target.value); update("rate", String(rates[e.target.value])); }} >{scrapTypes.map(s => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Estimated quantity (kg)"><input required type="number" min="0.1" step="0.1" value={order.estimate} onChange={e => update("estimate", e.target.value)}/></Field>
            <div className="field full">
              <label>Scrap photo</label>
              <label className="upload-box">
                {photoPreview ? <img src={photoPreview} alt="Scrap preview"/> : <><span className="upload-icon"><ImagePlus size={23}/></span><b>Upload a photo of your scrap</b><small>JPG or PNG · Up to 4 MB</small></>}
                <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} hidden/>
              </label>
            </div>
            <div className="field full">
              <label>Pickup location</label>
              <div className="location-row"><input required value={order.address} onChange={e => {update("address", e.target.value); update("mapUrl", "");}} placeholder="House no., street, area, city"/><button type="button" className="location-btn" onClick={useLocation}><LocateFixed size={16}/> Use GPS</button></div>
              <small className="helper">Allow location access when prompted, or enter the address manually.</small>
            </div>
            <Field label="Landmark (optional)" full><input value={order.landmark} onChange={e => update("landmark", e.target.value)} placeholder="Nearby landmark"/></Field>
            <div className="form-footer full"><span className="privacy-note"><MapPin size={14}/> Pickup address is shared with the assigned collector.</span><button className="primary-btn" type="submit">Submit request <ArrowRight size={17}/></button></div>
          </form>
        </section>}

        {role === "Admin" && <section className="panel">
          <PanelHeader icon={<ClipboardList/>} title="Order management" subtitle="Review incoming requests and assign a pickup partner."/>
          <div className="stats-row">
            <div className="stat"><small>New requests</small><strong>{order.status === "New request" ? "1" : "0"}</strong></div>
            <div className="stat"><small>Assigned / completed</small><strong>{assigned ? "1" : "0"}</strong></div>
            <div className="stat"><small>Total orders</small><strong>1</strong></div>
          </div>
          <div className="order-card">
            <div className="order-card-top"><div><span className="order-id">{order.id}</span><h3>{order.customer}</h3><small>{order.phone}</small></div><Status status={order.status}/></div>
            <div className="order-details">
              <div><PackageCheck size={17}/><span><b>{order.scrap}</b><small>Estimated {order.estimate} kg</small></span></div>
              <div><MapPin size={17}/><span><b>{order.address}</b><small>{order.landmark}</small></span></div>
              <div><CalendarDays size={17}/><span><b>Request date</b><small>{order.created}</small></span></div>
            </div>
            {order.photo && <div className="admin-photo"><img src={order.photo} alt="Customer scrap"/></div>}
            <form onSubmit={assignPickup} className="assign-row">
              <Field label="Assign pickup person"><select value={order.collector} onChange={e => update("collector", e.target.value)}><option>Ramesh</option><option>Suresh</option><option>Kiran</option></select></Field>
              <button className="primary-btn" type="submit" disabled={completed}> {assigned ? "Update assignment" : "Assign pickup"} <ArrowRight size={16}/></button>
            </form>
            {assigned && <div className="success-note"><CheckCircle2 size={16}/> Assigned to {order.collector}. Pickup person can now view the order.</div>}
          </div>
        </section>}

        {role === "Pickup Boy" && <section className="panel">
          <PanelHeader icon={<Bike/>} title="My pickup" subtitle="View your assigned order, navigate and record the collection."/>
          {!assigned ? <div className="empty-state"><Bike size={35}/><b>No assigned pickups yet</b><span>Switch to Admin and assign this order to a pickup person.</span></div> : <>
            <div className="pickup-banner"><div><span className="order-id">{order.id}</span><h3>{order.customer}</h3><small>Assigned to {order.collector}</small></div><Status status={order.status}/></div>
            <div className="address-box"><MapPin size={20}/><div><b>Pickup location</b><span>{order.address}</span><small>{order.landmark}</small></div></div>
            <button className="maps-btn" onClick={openMaps}><Navigation size={17}/> Navigate with Google Maps <ArrowRight size={16}/></button>
            <form onSubmit={completePickup} className="form-grid pickup-form">
              <div className="field full"><label>Actual collected weight (kg)</label><input type="number" required min="0.1" step="0.1" value={order.weight} onChange={e => update("weight", e.target.value)}/></div>
              <Field label="Rate per kg (₹)"><input type="number" min="0" step="0.5" value={order.rate} onChange={e => update("rate", e.target.value)}/></Field>
              <div className="amount-preview"><small>Calculated payment</small><strong>₹{amount.toFixed(2)}</strong></div>
              <div className="field full"><label>Payment method</label><div className="radio-row">{["UPI","Cash"].map(v => <label className="radio-option" key={v}><input type="radio" name="payment" checked={order.paymentMode === v} onChange={() => update("paymentMode", v)}/>{v}</label>)}</div></div>
              <Field label="Remarks (optional)" full><textarea value={order.remarks} onChange={e => update("remarks", e.target.value)} placeholder="Any notes about the collection" rows="2"/></Field>
              <div className="form-footer full"><span className="privacy-note"><IndianRupee size={14}/> Confirm the amount with the customer.</span><button className="primary-btn" disabled={completed} type="submit">{completed ? "Collection completed" : "Complete collection"} <CheckCircle2 size={17}/></button></div>
            </form>
          </>}
        </section>}

        {completed && <section className="invoice-card">
          <div className="invoice-head"><div className="invoice-brand"><span className="brand-icon"><Recycle size={19}/></span><div><b>ScrapLoop</b><small>Collection receipt</small></div></div><span className="paid-pill"><CheckCircle2 size={14}/> COMPLETED</span></div>
          <div className="invoice-title"><span>INVOICE / RECEIPT</span><h2>Thank you for recycling!</h2><small>Invoice #INV-1001 · {new Date().toLocaleDateString("en-IN")}</small></div>
          <div className="invoice-parties"><div><small>COLLECTED FROM</small><b>{order.customer}</b><span>{order.address}</span></div><div><small>COLLECTED BY</small><b>{order.collector}</b><span>{order.phone}</span></div></div>
          <div className="invoice-table"><div className="invoice-table-head"><span>Scrap item</span><span>Weight</span><span>Rate</span><span>Amount</span></div><div className="invoice-table-row"><b>{order.scrap}</b><span>{order.weight} kg</span><span>₹{Number(order.rate).toFixed(2)}</span><b>₹{amount.toFixed(2)}</b></div></div>
          <div className="invoice-total"><span>Total paid · {order.paymentMode}</span><strong>₹{amount.toFixed(2)}</strong></div>
          {order.remarks && <p className="invoice-remarks">Note: {order.remarks}</p>}
          <div className="invoice-actions"><button className="primary-btn" onClick={() => window.print()}><FileText size={16}/> Print / Save PDF</button><button className="secondary-btn" onClick={() => setInvoiceVisible(!invoiceVisible)}><Receipt size={16}/> {invoiceVisible ? "Hide invoice details" : "View invoice"}</button></div>
          <p className="invoice-footnote">This is a demonstration receipt generated by the ScrapLoop POC.</p>
        </section>}

        <footer><span><Recycle size={15}/> ScrapLoop</span><span>POC prototype · Sample data only</span></footer>
      </main>
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}

function Status({ status }) {
  const cls = status === "Completed" ? "green" : status === "Pickup assigned" ? "blue" : "amber";
  return <span className={`status ${cls}`}><span/> {status}</span>;
}
function Field({ label, children, full = false }) {
  return <div className={`field ${full ? "full" : ""}`}><label>{label}</label>{children}</div>;
}
function PanelHeader({ icon, title, subtitle }) {
  return <div className="panel-header"><span className="panel-icon">{icon}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>;
}

export default App;
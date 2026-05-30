import { useState, useEffect, useCallback, useRef } from "react";
import { Collapse } from "react-collapse";
import "./OrderTracker.css";
import {
  FaBox,
  FaGift,
  FaTruck,
  FaShippingFast,
  FaCheckCircle,
  FaHistory,
  FaShoppingCart,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { MdError } from "react-icons/md";

// ─── Constants ───────────────────────────────────────────────────────────────
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
const ORDERS_URL = `${API_BASE}/api/orders`;
const PIPELINE_URL = `${API_BASE}/api/orders/pipeline`;
const POLL_INTERVAL = 5000; // 5 seconds
const TOTAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calcProgress(placedAt) {
  if (!placedAt) return 0;
  const elapsed = Date.now() - new Date(placedAt).getTime();
  const pct = Math.min(100, Math.max(0, (elapsed / TOTAL_DURATION_MS) * 100));
  return Math.round(pct * 10) / 10;
}

const STAGE_ICONS = {
  ORDER_PLACED: <FaBox />,
  PACKED: <FaGift />,
  SHIPPED: <FaTruck />,
  OUT_FOR_DELIVERY: <FaShippingFast />,
  DELIVERED: <FaCheckCircle />,
};

// ─── Component: Stepper ───────────────────────────────────────────────────────
function Stepper({ order, pipeline }) {
  if (!pipeline || !order) return null;
  const currentIndex = pipeline.findIndex(
    (s) => s.status === order.current_status
  );

  return (
    <div className="ot-stepper">
      {pipeline.map((stage, idx) => {
        const isDone = idx < currentIndex;
        const isActive = idx === currentIndex || (idx === pipeline.length - 1 && order.current_status === "DELIVERED");
        const isCompleted = idx <= currentIndex || order.current_status === "DELIVERED";

        return (
          <div
            key={stage.status}
            className={`ot-step ${isDone || (order.current_status === "DELIVERED" && idx < pipeline.length - 1) ? "completed" : ""} ${isActive ? "active" : ""}`}
          >
            <div className="ot-step-node">
              {isDone || (order.current_status === "DELIVERED" && idx < pipeline.length - 1) ? (
                <span className="ot-step-check"><FaCheckCircle /></span>
              ) : (
                <span>{STAGE_ICONS[stage.status] || stage.icon}</span>
              )}
            </div>
            <span className="ot-step-label">{stage.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ProgressBar({ order }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!order) return;
    const tick = () => setPct(calcProgress(order.placed_at));
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, [order]);

  if (!order) return null;

  return (
    <div className="ot-progress-section">
      <div className="ot-progress-header">
        <span className="ot-progress-label">Delivery Progress</span>
        <span className="ot-progress-pct">{pct}%</span>
      </div>
      <div className="ot-progress-track">
        <div className="ot-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="ot-progress-times">
        <span>
          <span className="ot-time-label">Placed At</span>
          <span className="ot-time-value">{formatDate(order.placed_at)}</span>
        </span>
        <span>
          <span className="ot-time-label">Estimated Delivery</span>
          <span className="ot-time-value">{formatDate(order.estimated_delivery)}</span>
        </span>
      </div>
    </div>
  );
}

function Timeline({ history }) {
  if (!history || history.length === 0) return null;
  const reversed = [...history].reverse();

  return (
    <>
      <div className="ot-timeline-title">
        <FaHistory className="ot-title-icon" /> Tracking History
      </div>
      <div className="ot-timeline">
        {reversed.map((entry, idx) => (
          <div className="ot-tl-item" key={idx}>
            <div className={`ot-tl-dot ${idx === 0 ? "latest" : ""}`} />
            <div className="ot-tl-content">
              <div className="ot-tl-status">{entry.label || entry.status}</div>
              <div className="ot-tl-note">{entry.note}</div>
              <div className="ot-tl-time">{formatDate(entry.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function OrderCard({ order, pipeline, isExpanded, onToggle }) {
  const isDelivered = order.current_status === "DELIVERED";

  return (
    <div className={`ot-order-card ${isExpanded ? "is-expanded" : ""}`}>
      {/* ── Summary Header (Always Visible) ── */}
      <div className="ot-card-summary" onClick={onToggle}>
        <div className="ot-summary-top">
          <div className="ot-summary-left">
            <div className="ot-toggle-icon">
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div>
              <div className="ot-order-id">Order ID: #{order.id.slice(-8).toUpperCase()}</div>
              <div className="ot-order-meta-small">
                Placed {new Date(order.placed_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className={`ot-status-pill ${isDelivered ? "delivered" : "in-progress"}`}>
            {!isDelivered && <span className="ot-status-blink" />}
            {order.status_label || order.current_status.replace(/_/g, " ")}
          </div>
        </div>

        {/* Progress Bar in Header */}
        <div className="ot-summary-progress">
          <ProgressBar order={order} isCompact={true} />
        </div>
      </div>

      {/* ── Detailed Content (Collapsible) ── */}
      <Collapse isOpened={isExpanded}>
        <div className="ot-card-details">
          <div className="ot-divider" />

          {/* Stepper */}
          <Stepper order={order} pipeline={pipeline} />

          <div className="ot-divider" />
          <Timeline history={order.history} />

          <div className="ot-divider" />
          <div className="ot-meta-grid">
            <div className="ot-meta-item">
              <div className="ot-meta-key">Shipping To</div>
              <div className="ot-meta-val">
                <strong>{order.customerName}</strong><br />
                {order.address}
              </div>
            </div>
            <div className="ot-meta-item">
              <div className="ot-meta-key">Payment Info</div>
              <div className="ot-meta-val">
                Total: <strong>₹{order.totalAmt.toLocaleString("en-IN")}</strong><br />
                Status: {order.payment_status}
              </div>
            </div>
          </div>

          <div className="ot-divider" />
          <div className="ot-meta-key">Order Summary</div>
          <div className="ot-items-list">
            {order.products.map((item, i) => (
              <div key={i} className="ot-item-row">
                {item.image && <img src={item.image} alt={item.productTitle} className="ot-item-img" />}
                <div className="ot-item-name">{item.productTitle.substring(0, 40) + "..."}</div>
                <div className="ot-item-qty">Qty: {item.quantity}</div>
                <div className="ot-item-price">₹{item.price.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  );
}

export default function OrderTracker() {
  const [pipeline, setPipeline] = useState(null);
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const pollRef = useRef(null);

  // ── Fetch everything ──
  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const token = localStorage.getItem("accesstoken");

    try {
      // Parallel fetch pipeline and orders
      const [pipeRes, orderRes] = await Promise.all([
        fetch(PIPELINE_URL, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(ORDERS_URL, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const [pipeData, orderData] = await Promise.all([
        pipeRes.json(),
        orderRes.json()
      ]);

      if (pipeData.success) setPipeline(pipeData.data);
      if (orderData.success) {
        setOrders(orderData.data);
        setError("");
      } else {
        throw new Error(orderData.message || "Failed to load orders");
      }
      setLastUpdated(new Date());
    } catch (err) {
      if (!isSilent) setError(err.message);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllData();
    pollRef.current = setInterval(() => fetchAllData(true), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [fetchAllData]);

  return (
    <div className="ot-root">


      <main className="ot-main">
        <div className="ot-orders-list-header">
          <div>
            <h2 className="ot-section-title">My Orders</h2>
            <p className="ot-section-desc">We're moving fast! See exactly where your packages are.</p>
          </div>
        </div>

        {error && <div className="ot-error-msg"><MdError /> {error}</div>}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[1, 2].map(i => (
              <div key={i} className="ot-order-card">
                <div className="ot-skeleton" style={{ height: 30, width: "30%", marginBottom: 15 }} />
                <div className="ot-skeleton" style={{ height: 100, width: "100%", marginBottom: 30 }} />
                <div className="ot-skeleton" style={{ height: 40, width: "100%" }} />
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && orders.length === 0 && (
          <div className="ot-empty-state">
            <div className="ot-empty-icon"><FaShoppingCart /></div>
            <div className="ot-empty-title">No orders found</div>
            <p>You haven't placed any orders yet. Start shopping to track your deliveries!</p>
            <a href="/" className="ot-btn-cta">Start Shopping</a>
          </div>
        )}

        {/* ── Active Orders List ── */}
        {!loading && orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            pipeline={pipeline}
            isExpanded={expandedId === order.id}
            onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
          />
        ))}
      </main>
    </div>
  );
}

import React, { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Avatar from "../components/ui/avatar";
import sampleCsv from "../../public/sample-data.csv";

const parseCSV = async (filePath) => {
  // fetch the CSV as text (Vite serves public/)
  const res = await fetch(filePath);
  const text = await res.text();

  return new Promise((resolve) => {
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
    });
  });
};

export default function Dashboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    parseCSV("/sample-data.csv").then((data) => {
      // normalize some fields and dates
      const normalized = data
        .map((r, i) => ({
          id: i + 1,
          date: r.date || r.Date || "",
          amount: Number(r.amount || r.payment || 0),
          claim_status: r.claim_status || r.status || "paid",
          patient: r.patient || r.name || "Unknown",
        }))
        .filter((r) => r.date);

      setRows(normalized);
    });
  }, []);

  const last30 = useMemo(() => {
    const cutoff = dayjs().subtract(30, "day");
    return rows.filter((r) => dayjs(r.date).isAfter(cutoff));
  }, [rows]);

  const totalPayments = last30.reduce((s, r) => s + r.amount, 0);
  const totalClaims = last30.length;
  const gcr = totalClaims
    ? ((totalPayments / (totalClaims * 1000)) * 100).toFixed(2)
    : "0.00"; // dummy denom to avoid divide by zero

  const paymentsByDay = useMemo(() => {
    const map = {};
    last30.forEach((r) => {
      const d = dayjs(r.date).format("YYYY-MM-DD");
      map[d] = (map[d] || 0) + r.amount;
    });

    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, amt]) => ({ date, amt }));
  }, [last30]);

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="brand">
          <div className="logo">RCM</div>
          <div>
            <h2 style={{ margin: 0 }}>RCM Dashboard UI</h2>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Reactive billing & collections
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button>Export</Button>
          <Avatar initials="JD" />
        </div>
      </div>

      {/* KPI Section */}
      <div className="kpis">
        <Card>
          <h3>Gross Collection Rate</h3>
          <div className="value">{gcr}%</div>
          <div className="footer-note">
            Last 30 days · {totalClaims} claims
          </div>
        </Card>

        <Card>
          <h3>Total Payments</h3>
          <div className="value">₹{totalPayments.toLocaleString()}</div>
          <div className="footer-note">Last 30 days</div>
        </Card>

        <Card>
          <h3>Denial Rate</h3>
          <div className="value">4.2%</div>
          <div className="footer-note">Last 30 days</div>
        </Card>

        <Card>
          <h3>AR+ 90 days</h3>
          <div className="value">
            ₹
            {(
              totalPayments * 0.12
            ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="footer-note">Aging bucket</div>
        </Card>

        <Card>
          <h3>AR+ 90 days</h3>
          <div className="value">
            ₹
            {(
              totalPayments * 0.12
            ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="footer-note">Aging bucket</div>
        </Card>

        <Card>
          <h3>AR+ 90 days</h3>
          <div className="value">
            ₹
            {(
              totalPayments * 0.12
            ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="footer-note">Aging bucket</div>
        </Card>
      </div>

      {/* Charts + Side KPIs */}
      <div className="grid">
        <div>
          <Card className="chart">
            <h3 style={{ marginBottom: 8 }}>Payments (last 30 days)</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paymentsByDay}>
                  <XAxis dataKey="date" hide={false} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amt"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="cards-section">
              <h4 style={{ margin: "76px 0" }}></h4>
              <div className="cards-grid">
                {rows.slice(0, 2).map((r) => (
                  <div key={r.id} className="claim-card">
                    {/* Two KPI mini-cards */}
                    <div className="row-kpis"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="kpis2">
          <Card>
            <h3>AR+ 90 days</h3>
            <div className="value">
              ₹
              {(
                totalPayments * 0.12
              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="footer-note">Aging bucket</div>
          </Card>

          <Card>
            <h3>AR+ 90 days</h3>
            <div className="value">
              ₹
              {(
                totalPayments * 0.12
              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="footer-note">Aging bucket</div>
          </Card>

          <Card>
            <h3>AR+ 90 days</h3>
            <div className="value">
              ₹
              {(
                totalPayments * 0.12
              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="footer-note">Aging bucket</div>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="kpis3">
        <Card>
          <h3>Top Providers</h3>
          <div className="small-list">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Provider A</div>
              <div>₹{(totalPayments * 0.3).toLocaleString()}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Provider B</div>
              <div>₹{(totalPayments * 0.18).toLocaleString()}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Provider C</div>
              <div>₹{(totalPayments * 0.12).toLocaleString()}</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <Button>View all providers</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

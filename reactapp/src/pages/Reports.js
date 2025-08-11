import React, { useEffect, useState } from "react";
import { getReports } from "../services/reportsService";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import "../styles/pages.css";
import "../styles/components.css";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getReports()
      .then((res) => {
        setReportData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports");
        setLoading(false);
      });
  }, []);

  // Chart configuration options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  if (loading) {
    return <div className="page glass"><h2>Loading reports...</h2></div>;
  }

  if (error) {
    return <div className="page glass"><h2>Error: {error}</h2></div>;
  }

  if (!reportData) {
    return <div className="page glass"><h2>No report data available</h2></div>;
  }

  // Convert maps to arrays for chart compatibility
  const employeesPerDept = reportData.employeesPerDepartment || {};
  const skillsCount = reportData.skillsCount || {};

  // Create department data for bar chart
  const departmentNames = Object.keys(employeesPerDept);
  const departmentEmployeeCounts = Object.values(employeesPerDept);

  // Create skill data for pie chart
  const skillNames = Object.keys(skillsCount);
  const skillCounts = Object.values(skillsCount);

  // Bar Chart for employees per department
  const departmentSkillData = departmentNames.length > 0 ? {
    labels: departmentNames,
    datasets: [
      {
        label: "Employees per Department",
        data: departmentEmployeeCounts,
        backgroundColor: "rgba(27, 60, 83, 0.7)", // Dark blue from your palette
        borderColor: "rgba(27, 60, 83, 1)",
        borderWidth: 1
      }
    ]
  } : null;

  // Pie Chart for skill distribution
  const skillDistributionData = skillNames.length > 0 ? {
    labels: skillNames,
    datasets: [
      {
        label: "Skill Count",
        data: skillCounts,
        backgroundColor: [
          "rgba(27, 60, 83, 0.7)",   // Dark blue
          "rgba(69, 104, 130, 0.7)",  // Medium blue
          "rgba(210, 193, 182, 0.7)", // Beige
          "rgba(249, 243, 239, 0.7)", // Off-white
          "rgba(150, 170, 190, 0.7)"  // Additional shade
        ],
        borderColor: [
          "rgba(27, 60, 83, 1)",
          "rgba(69, 104, 130, 1)",
          "rgba(210, 193, 182, 1)",
          "rgba(249, 243, 239, 1)",
          "rgba(150, 170, 190, 1)"
        ],
        borderWidth: 1
      }
    ]
  } : null;

  return (
    <div className="page glass">
      <h1>Reports & Analytics</h1>

      <div className="charts-container">
        {departmentNames.length > 0 && departmentSkillData && (
          <div className="chart-wrapper glass">
            <h2>Employees per Department</h2>
            <div className="chart-container" style={{ height: '300px' }}>
              <Bar 
                data={departmentSkillData} 
                options={chartOptions}
              />
            </div>
          </div>
        )}

        {skillNames.length > 0 && skillDistributionData && (
          <div className="chart-wrapper glass">
            <h2>Skill Distribution</h2>
            <div className="chart-container" style={{ height: '300px' }}>
              <Pie 
                data={skillDistributionData} 
                options={pieOptions}
              />
            </div>
          </div>
        )}

        {departmentNames.length === 0 && skillNames.length === 0 && (
          <div className="no-data-message">
            <h2>No data available for reports</h2>
          </div>
        )}
      </div>
    </div>
  );
}
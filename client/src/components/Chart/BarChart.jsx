import React, { useContext } from "react";
import { Column } from "@ant-design/plots";
import { InvoiceContext } from "../../context/InvoiceProvider";
import moment from "moment";

export const BarChart = () => {
  const { allData } = useContext(InvoiceContext);

  const getData = () => {
    const data = [];

    const today = new Date();
    const previousMonths = [];
    for (let i = 0; i < 12; i++) {
      const month = today.getMonth() - i;
      const year = today.getFullYear();
      const date = new Date(year, month, 1);
      previousMonths.push(
        date.toLocaleString("default", { month: "short", year: "numeric" })
      );
    }

    const period = previousMonths.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {});

    if (allData) {
      for (const invoice of allData) {
        const date = moment(invoice.data.createdAt, "DD-MM-YYYY");
        if (invoice.data.status === "paid") {
          const key = date.format("MMM YYYY");
          period[key] += invoice.data.total;
        }
      }
      Object.keys(period).map((key) => {
        data.push({
          type: key,
          sales: period[key],
        });
        return null;
      });
      data.reverse();
    }

    const config = {
      data,
      color: "rgb(119,94,241)",
      xField: "type",
      yField: "sales",
      columnWidthRatio: 0.8,
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      meta: {
        type: {
          alias: "Revenue",
        },
        sales: {
          alias: "Revenue",
        },
      },
    };
    return config;
  };

  const config = getData();

  return <Column {...config} />;
};

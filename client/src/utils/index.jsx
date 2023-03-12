import { Avatar } from "@mui/material";
import moment from "moment";

export const buttonStyles = {
  borderRadius: "10em",
  padding: "1em 1.5em",
  fontSize: ".7rem",
  fontFamily: "Spartan",
  textTransform: "capitalize",
  color: "rgb(128,136,191)",
};

export const authFormStyles = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "rgba(255,255,255,.6)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,1)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(255,255,255,1)",
    },
  },
  "& .MuiFormLabel-root": {
    color: "rgba(255,255,255,.6)",
    "&.Mui-focused": {
      color: "rgba(255,255,255,1)",
    },
  },
};

export const checkboxStyles = {
  "& .MuiSvgIcon-root": {
    fontSize: 21,
    color: "rgb(119,94,241)",
  },
  "&.Mui-checked": {
    color: "green",
  },
  "& .MuiTypography-root": {
    fontSize: 12,
    fontFamily: "Spartan",
    color: "black",
  },
};

export const avatarRender = (profilePicture, firstName, lastName, size) => {
  if (profilePicture) {
    return (
      <Avatar
        src={profilePicture}
        alt={`${firstName} ${lastName}`}
        sx={{ width: size, height: size }}
      />
    );
  } else if (firstName && lastName) {
    return (
      <Avatar sx={{ width: size, height: size }}>{`${firstName.charAt(
        0
      )}${lastName.charAt(0)}`}</Avatar>
    );
  } else {
    return <Avatar sx={{ width: size, height: size }} />;
  }
};

export const invoiceTotal = (invoice) => {
  const temp = [];
  if (!invoice) return null;
  invoice.services.forEach((service) => {
    temp.push(service.price * service.quantity);
  });
  return temp.reduce((a, b) => a + b, 0);
};

export const color = (invoice) => {
  if (invoice.data.status === "paid") {
    return "text-done";
  }
  if (invoice.data.status === "pending") {
    return "text-pending";
  }
  if (invoice.data.status === "draft") {
    return "text-draft dark:text-draft-dark";
  }
};

export const bg = (invoice) => {
  if (invoice.data.status === "paid") {
    return "bg-done";
  }
  if (invoice.data.status === "pending") {
    return "bg-pending";
  }
  if (invoice.data.status === "draft") {
    return "bg-draft dark:bg-draft-dark dark:bg-opacity-5";
  }
};

export const getCurrentDate = () => {
  const date = new Date();

  let day = date.getDate();
  day = day < 10 ? "0" + day : day;

  let month = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;

  const year = date.getFullYear();

  const formattedDate = day + "-" + month + "-" + year;

  return formattedDate;
};

export const getPaidTotal = (allData) => {
  if (allData) {
    let total = 0;
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const currentDate = new Date(year, month, 1).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    for (const invoice of allData && allData) {
      if (
        invoice.data.status === "paid" &&
        moment(invoice.data.createdAt, "DD-MM-YYYY").format("MMM YYYY") ===
          currentDate
      ) {
        total += invoice.data.total;
      }
    }
    return total;
  }
};

export const getPendingTotal = (allData) => {
  if (allData) {
    let total = 0;
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const currentDate = new Date(year, month, 1).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    for (const invoice of allData && allData) {
      if (
        invoice.data.status === "pending" &&
        moment(invoice.data.createdAt, "DD-MM-YYYY").format("MMM YYYY") ===
          currentDate
      ) {
        total += invoice.data.total;
      }
    }
    return total;
  }
};

export const getInvoicesNumber = (allData) => {
  if (allData) {
    let total = 0;
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const currentDate = new Date(year, month, 1).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    for (const invoice of allData && allData) {
      if (invoice.data.status === "pending" || invoice.data.status === "paid") {
        if (
          moment(invoice.data.createdAt, "DD-MM-YYYY").format("MMM YYYY") ===
          currentDate
        ) {
          total += 1;
        }
      }
    }
    return total;
  }
};

export const getYearData = (allData) => {
  if (allData) {
    let invoices = 0;
    let amount = 0;
    const year = new Date().getFullYear();
    const currentYear = new Date(year, 1).toLocaleString("default", {
      year: "numeric",
    });
    for (const invoice of allData && allData) {
      if (
        moment(invoice.data.createdAt, "DD-MM-YYYY").format("YYYY") ===
        currentYear
      ) {
        invoices += 1;
        amount += invoice.data.total;
      }
    }
    return [invoices, amount];
  }
};

import { useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { InvoiceContext } from "../context/InvoiceProvider";
import { checkboxStyles } from "../utils";

export default function Checkboxes() {
  const { checked, setChecked, setFilteredInvoices, allData } =
    useContext(InvoiceContext);

  const filterInvoices = () => {
    const selectedStatus = {
      paid: checked[0],
      pending: checked[1],
      draft: checked[2],
    };
    setFilteredInvoices(
      allData.filter((invoice) => selectedStatus[invoice.data.status])
    );
  };

  useEffect(() => {
    filterInvoices();
  }, [checked]);

  const handleChange1 = (event) => {
    setChecked([
      event.target.checked,
      event.target.checked,
      event.target.checked,
    ]);
  };

  const handleChange2 = (event) => {
    setChecked([event.target.checked, checked[1], checked[2]]);
  };

  const handleChange3 = (event) => {
    setChecked([checked[0], event.target.checked, checked[2]]);
  };

  const handleChange4 = (event) => {
    setChecked([checked[0], checked[1], event.target.checked]);
  };

  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      <FormControlLabel
        label="Paid"
        sx={{
          ...checkboxStyles,
        }}
        control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
      />
      <FormControlLabel
        label="Pending"
        sx={{
          ...checkboxStyles,
        }}
        control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
      />
      <FormControlLabel
        label="Draft"
        sx={{
          ...checkboxStyles,
        }}
        control={<Checkbox checked={checked[2]} onChange={handleChange4} />}
      />
    </Box>
  );

  return (
    <div>
      <FormControlLabel
        label="Show all/ none"
        sx={{
          ...checkboxStyles,
        }}
        control={
          <Checkbox
            checked={checked[0] && checked[1] && checked[2]}
            indeterminate={
              checked[0] !== true || checked[1] !== true || checked[2] !== true
            }
            onChange={handleChange1}
          />
        }
      />
      {children}
    </div>
  );
}

import { useState } from "react"
import { Typography, Paper, TextField, Button, Grid, MenuItem } from "@mui/material"

function Donate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    foodType: "",
    quantity: "",
    pickupAddress: "",
    pickupDate: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Donate Food
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField required fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField required fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              select
              label="Food Type"
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
            >
              <MenuItem value="prepared">Prepared Meals</MenuItem>
              <MenuItem value="produce">Fresh Produce</MenuItem>
              <MenuItem value="canned">Canned Goods</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Quantity (in lbs or number of meals)"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Pickup Address"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Preferred Pickup Date"
              name="pickupDate"
              type="date"
              value={formData.pickupDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit Donation
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default Donate


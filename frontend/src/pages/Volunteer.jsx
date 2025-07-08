import { useState } from "react"
import { Typography, Paper, TextField, Button, Grid, Checkbox, FormControlLabel } from "@mui/material"

function Volunteer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    interests: "",
  })

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        type === "checkbox"
          ? {
              ...prevState.availability,
              [name]: checked,
            }
          : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Volunteer with FoodShare
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
          <Grid item xs={12}>
            <TextField required fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Availability
            </Typography>
            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
              <FormControlLabel
                key={day}
                control={<Checkbox checked={formData.availability[day]} onChange={handleChange} name={day} />}
                label={day.charAt(0).toUpperCase() + day.slice(1)}
              />
            ))}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Interests and Skills"
              name="interests"
              multiline
              rows={4}
              value={formData.interests}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit Volunteer Application
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default Volunteer


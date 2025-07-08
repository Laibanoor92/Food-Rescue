import { Typography, Button, Grid, Card, CardContent, Box, Container, TextField, IconButton } from "@mui/material"
import {
  Restaurant,
  LocalShipping,
  Favorite,
  People,
  AccessTime,
  Nature,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from "@mui/icons-material"
import { Link as RouterLink } from "react-router-dom"

function Home() {
  return (
    <>
      <Grid container spacing={4} sx={{ mt: 4, mb: 8 }}>
        <Grid item xs={12}>
          <Typography variant="h2" align="center" gutterBottom>
            Reduce Waste, Feed Hope
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Connect surplus food with those who need it most.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" size="large" component={RouterLink} to="/signup">
                Donate Food
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary" size="large" component={RouterLink} to="/signup">
                Request Food
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <Restaurant />,
                title: "Donate Surplus",
                description: "Restaurants, grocers, and individuals can easily donate their excess food.",
              },
              {
                icon: <LocalShipping />,
                title: "We Deliver",
                description: "Our network of volunteers picks up and delivers food to those in need.",
              },
              {
                icon: <Favorite />,
                title: "Feed the Community",
                description: "Your donations help feed individuals and families facing food insecurity.",
              },
            ].map((feature, index) => (
              <Grid item key={index} xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                      {feature.icon}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" align="center">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Impact
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: <People />, title: "1 Million+", description: "People Served" },
              { icon: <AccessTime />, title: "500,000 lbs", description: "Food Waste Prevented" },
              { icon: <Nature />, title: "200+ Tons", description: "CO2 Emissions Reduced" },
            ].map((stat, index) => (
              <Grid item key={index} xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                      {stat.icon}
                    </Typography>
                    <Typography gutterBottom variant="h4" component="div" align="center">
                      {stat.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {stat.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Box
        component="footer"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 6,
          mt: "auto",
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                About FoodShare
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                FoodShare is dedicated to reducing food waste and fighting hunger in our communities. We connect surplus
                food with those who need it most.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Quick Links
              </Typography>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  "& a": {
                    color: "inherit",
                    textDecoration: "none",
                    display: "block",
                    marginBottom: "0.5rem",
                    "&:hover": { textDecoration: "underline" },
                  },
                }}
              >
                {/* <RouterLink to="/about">About Us</RouterLink>
                <RouterLink to="/donate">Donate Food</RouterLink>
                <RouterLink to="/request">Request Food</RouterLink>
                <RouterLink to="/volunteer">Volunteer</RouterLink> */}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Stay Connected
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your email"
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                }}
              />
              <Button variant="contained" color="secondary" fullWidth sx={{ mb: 2 }}>
                Subscribe
              </Button>
              <Box
                sx={{ mt: 2, "& .MuiIconButton-root": { mr: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } } }}
              >
                <IconButton color="inherit" aria-label="Facebook">
                  <Facebook />
                </IconButton>
                <IconButton color="inherit" aria-label="Twitter">
                  <Twitter />
                </IconButton>
                <IconButton color="inherit" aria-label="Instagram">
                  <Instagram />
                </IconButton>
                <IconButton color="inherit" aria-label="LinkedIn">
                  <LinkedIn />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: "center", opacity: 0.8 }}>
            © {new Date().getFullYear()} FoodShare. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  )
}

export default Home









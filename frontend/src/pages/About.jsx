// import { Typography, Grid, Box, Container } from "@mui/material"

// function About() {
//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 8, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
//       <Typography variant="h2" gutterBottom align="center" sx={{ mb: 6, color: "primary.main", fontWeight: "bold" }}>
//         About FoodShare
//       </Typography>

//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             FoodShare is a non-profit organization dedicated to reducing food waste and fighting hunger in our
//             communities. We connect businesses and individuals with surplus food to local charities and people in need.
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             Our mission is to create a sustainable and equitable food system where no edible food goes to waste, and no
//             one goes hungry.
//           </Typography>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Box
//             component="img"
//             sx={{
//               width: "100%",
//               height: "auto",
//               borderRadius: 2,
//               boxShadow: 3,
//             }}
//             alt="Food donation"
//             src="/placeholder.svg?height=300&width=400"
//           />
//         </Grid>
//       </Grid>

//       <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3, color: "secondary.main", fontWeight: "bold" }}>
//         The Problem of Food Waste
//       </Typography>
//       <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//         Food waste is a global issue with far-reaching impacts on food security, the environment, and the economy:
//       </Typography>
//       <ul style={{ paddingLeft: "1.5rem", marginBottom: "2rem" }}>
//         <Typography
//           component="li"
//           variant="body1"
//           paragraph
//           sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}
//         >
//           Approximately 1.3 billion tonnes of food is wasted globally each year, which is enough to feed 3 billion
//           people.
//         </Typography>
//         <Typography
//           component="li"
//           variant="body1"
//           paragraph
//           sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}
//         >
//           In the United States alone, 30-40% of the food supply goes to waste, equating to more than 20 pounds of food
//           per person per month.
//         </Typography>
//         <Typography
//           component="li"
//           variant="body1"
//           paragraph
//           sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}
//         >
//           Food waste generates about 8% of global greenhouse gas emissions.
//         </Typography>
//       </ul>

//       <Grid container spacing={4} sx={{ mt: 4 }}>
//         <Grid item xs={12} md={6}>
//           <Box
//             component="img"
//             sx={{
//               width: "100%",
//               height: "auto",
//               borderRadius: 2,
//               boxShadow: 3,
//             }}
//             alt="Hungry child"
//             src="/placeholder.svg?height=300&width=400"
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Typography variant="h5" gutterBottom sx={{ color: "secondary.main", fontWeight: "bold" }}>
//             The Impact of Hunger
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • 690 million people go hungry each day
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • 149 million children under 5 are stunted due to malnutrition
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • Hunger leads to decreased productivity and increased healthcare costs
//           </Typography>
//         </Grid>
//       </Grid>

//       <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3, color: "secondary.main", fontWeight: "bold" }}>
//         How FoodShare Makes a Difference
//       </Typography>
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           <Typography variant="h5" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
//             Our Impact
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • Over 1 million meals served
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • 500,000 lbs of food waste prevented
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • 200+ partner organizations
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • $3 million in economic value created
//           </Typography>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Typography variant="h5" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
//             Get Involved
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • Donate surplus food
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • Volunteer your time
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • Spread the word
//           </Typography>
//           <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
//             • Contribute financially
//           </Typography>
//         </Grid>
//       </Grid>
//     </Container>
//   )
// }

// export default About





import { Typography, Grid, Box, Container } from "@mui/material";

function About() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8, fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}>
      <Typography variant="h2" gutterBottom align="center" sx={{ mb: 6, color: "primary.main", fontWeight: "bold" }}>
        About FoodShare
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            FoodShare is a mission-driven initiative committed to reducing food waste and combating hunger. We bridge the gap between surplus food from businesses and individuals, and those in need, ensuring that no edible food goes to waste.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            Our goal is to build a sustainable food system where everyone has access to nutritious meals, while also minimizing environmental impact.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{ width: "100%", height: "auto", borderRadius: 2, boxShadow: 3 }}
            alt="Food donation"
            src="/placeholder.svg?height=300&width=400"
          />
        </Grid>
      </Grid>

      <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3, color: "secondary.main", fontWeight: "bold" }}>
        The Challenge of Food Waste
      </Typography>
      <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
        Food waste is a critical global issue affecting food security, the environment, and the economy:
      </Typography>
      <ul style={{ paddingLeft: "1.5rem", marginBottom: "2rem" }}>
        <Typography component="li" variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
          1.3 billion tonnes of food are wasted globally each year—enough to feed 3 billion people.
        </Typography>
        <Typography component="li" variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
          30-40% of the U.S. food supply is wasted, equating to over 20 pounds per person per month.
        </Typography>
        <Typography component="li" variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
          Food waste contributes to nearly 8% of global greenhouse gas emissions.
        </Typography>
      </ul>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            sx={{ width: "100%", height: "auto", borderRadius: 2, boxShadow: 3 }}
            alt="Hungry child"
            src="/placeholder.svg?height=300&width=400"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ color: "secondary.main", fontWeight: "bold" }}>
            The Reality of Hunger
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • 690 million people experience hunger daily.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • 149 million children under five suffer from malnutrition-related stunting.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • Hunger reduces productivity and increases healthcare costs.
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3, color: "secondary.main", fontWeight: "bold" }}>
        How FoodShare is Making an Impact
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
            Our Achievements
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • Over 1 million meals provided.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • 500,000 lbs of food waste prevented.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • 200+ partner organizations supporting our cause.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • $3 million in economic value generated.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ color: "primary.main", fontWeight: "bold" }}>
            How You Can Help
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • Donate surplus food to feed those in need.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • Volunteer your time to support food distribution efforts.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • Raise awareness about food waste and hunger.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#333" }}>
            • Contribute financially to help expand our reach.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default About;

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import { 
  StorefrontOutlined, 
  RestaurantOutlined, 
  LocalShippingOutlined, 
  GroupsOutlined,
  CheckCircleOutline,
  PhoneOutlined,
  ScheduleOutlined,
  InventoryOutlined,
  DeliveryDiningOutlined,
  FavoriteBorderOutlined,
  BarChartOutlined,
  VolunteerActivismOutlined
} from '@mui/icons-material';
import { Link as RouterLink } from "react-router-dom";
const HowItWorksPage = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          How Our Food Rescue Works
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          From surplus to service: A step-by-step guide to our food rescue process
        </Typography>
      </Box>

      {/* Mission Statement */}
      <Paper elevation={0} sx={{ bgcolor: 'primary.light', p: 4, mb: 6, color: 'white', borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>Our Mission</Typography>
            <Typography variant="body1">
              We're building a more sustainable and equitable food system by connecting surplus food 
              from businesses with the communities that need it most. Our platform reduces food waste 
              while fighting hunger, creating environmental benefits, and strengthening community bonds.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <FavoriteBorderOutlined sx={{ fontSize: 100, opacity: 0.8 }} />
          </Grid>
        </Grid>
      </Paper>

      {/* Overview */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          The Food Rescue Ecosystem
        </Typography>
        <Typography variant="body1" paragraph>
          Our platform creates a seamless connection between food donors and recipient organizations. 
          Here's how the different parts of our system work together to rescue food that would otherwise go to waste.
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image="/api/placeholder/400/140"
                alt="Grocery store icon"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  <StorefrontOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Food Donors
                </Typography>
                <Typography>
                  Grocery stores, restaurants, caterers, farms, and other businesses with surplus food.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image="/api/placeholder/400/140"
                alt="Platform icon"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  <InventoryOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Our Platform
                </Typography>
                <Typography>
                  Digital tools that connect and coordinate all participants in the food rescue ecosystem.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image="/api/placeholder/400/140"
                alt="Delivery vehicle icon"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  <LocalShippingOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Transport Network
                </Typography>
                <Typography>
                  Volunteer drivers and logistics partners who move food from donors to recipients.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image="/api/placeholder/400/140"
                alt="Community organization icon"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  <GroupsOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recipients
                </Typography>
                <Typography>
                  Food banks, shelters, community kitchens, and other organizations serving those in need.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Process Step-by-Step */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          The Food Rescue Process
        </Typography>
        <Typography variant="body1" paragraph>
          Our streamlined process makes food donation and distribution efficient and reliable for all participants.
        </Typography>

        <Stepper orientation="vertical" sx={{ mt: 4 }}>
          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Food Donors List Surplus</Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Typography>
                  Grocery stores, restaurants, and other food businesses use our platform to quickly list surplus food. 
                  They provide details about:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><InventoryOutlined color="primary" /></ListItemIcon>
                    <ListItemText primary="Type and quantity of food available" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ScheduleOutlined color="primary" /></ListItemIcon>
                    <ListItemText primary="Pickup window" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><StorefrontOutlined color="primary" /></ListItemIcon>
                    <ListItemText primary="Location information" />
                  </ListItem>
                </List>
                <CardMedia
                  component="img"
                  sx={{ maxHeight: 300, objectFit: 'contain', my: 2 }}
                  image="/api/placeholder/600/300"
                  alt="Food donation listing interface"
                />
                <Typography variant="body2" color="text.secondary">
                  Our system makes it easy for busy food businesses to list donations in under 2 minutes.
                </Typography>
              </Box>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Recipient Organizations Claim Donations</Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Typography>
                  Food banks, shelters, and community kitchens receive real-time notifications about available food 
                  that matches their needs. They can:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Browse available donations filtered by food type, quantity, and location" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Claim donations that meet their current needs" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Schedule pickups based on their capacity" />
                  </ListItem>
                </List>
                <CardMedia
                  component="img"
                  sx={{ maxHeight: 300, objectFit: 'contain', my: 2 }}
                  image="/api/placeholder/600/300"
                  alt="Recipient organization interface"
                />
                <Typography variant="body2" color="text.secondary">
                  Our platform allows recipient organizations to claim only what they need and can distribute effectively.
                </Typography>
              </Box>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Transportation Coordination</Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Typography>
                  Once a donation is claimed, our system coordinates the transportation:
                </Typography>
                <Grid container spacing={4} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', bgcolor: 'background.light' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Option 1: Volunteer Drivers
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon><DeliveryDiningOutlined color="primary" /></ListItemIcon>
                            <ListItemText primary="Volunteers receive pickup requests via our app" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><DeliveryDiningOutlined color="primary" /></ListItemIcon>
                            <ListItemText primary="Accept runs based on their availability and location" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><DeliveryDiningOutlined color="primary" /></ListItemIcon>
                            <ListItemText primary="Follow in-app guidance for pickup and delivery" />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', bgcolor: 'background.light' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Option 2: Self-Transport
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon><LocalShippingOutlined color="primary" /></ListItemIcon>
                            <ListItemText primary="Recipient organizations use their own vehicles" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><LocalShippingOutlined color="primary" /></ListItemIcon>
                            <ListItemText primary="Receive detailed pickup instructions" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><LocalShippingOutlined color="primary" /></ListItemIcon>
                            <ListItemText primary="Coordinate directly with donors via our system" />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <CardMedia
                  component="img"
                  sx={{ maxHeight: 300, objectFit: 'contain', my: 2 }}
                  image="/api/placeholder/600/300"
                  alt="Transportation coordination interface"
                />
              </Box>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Food Pickup and Delivery</Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Typography>
                  Our system ensures smooth handoffs between all parties:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Digital Confirmation" 
                      secondary="QR codes or digital signatures verify each successful pickup and delivery" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Quality Control" 
                      secondary="Food safety guidelines and checklists integrated into our process" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Real-time Updates" 
                      secondary="All parties receive status notifications throughout the journey" 
                    />
                  </ListItem>
                </List>
                <CardMedia
                  component="img"
                  sx={{ maxHeight: 300, objectFit: 'contain', my: 2 }}
                  image="/api/placeholder/600/300"
                  alt="Food pickup and delivery process"
                />
              </Box>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Distribution to Those in Need</Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Typography>
                  Recipient organizations distribute the rescued food through their established channels:
                </Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{ height: 100, width: 100, objectFit: 'contain' }}
                        image="/api/placeholder/100/100"
                        alt="Food bank distribution"
                      />
                      <CardContent>
                        <Typography align="center">Food Banks</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{ height: 100, width: 100, objectFit: 'contain' }}
                        image="/api/placeholder/100/100"
                        alt="Meal programs"
                      />
                      <CardContent>
                        <Typography align="center">Meal Programs</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                    <CardMedia
                        component="img"
                        sx={{ height: 100, width: 100, objectFit: 'contain' }}
                        image="/api/placeholder/100/100"
                        alt="Community kitchens"
                      />
                      <CardContent>
                        <Typography align="center">Community Kitchens</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{ height: 100, width: 100, objectFit: 'contain' }}
                        image="/api/placeholder/100/100"
                        alt="Shelter services"
                      />
                      <CardContent>
                        <Typography align="center">Shelter Services</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <CardMedia
                  component="img"
                  sx={{ maxHeight: 300, objectFit: 'contain', my: 2 }}
                  image="/api/placeholder/600/300"
                  alt="Food distribution to community"
                />
                <Typography variant="body2" color="text.secondary">
                  Our platform helps organizations track and report on the impact of distributed food.
                </Typography>
              </Box>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Impact Tracking and Reporting</Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Typography>
                  Our system tracks every donation and generates detailed impact reports:
                </Typography>
                <Grid container spacing={4} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', bgcolor: 'success.light', color: 'white' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <BarChartOutlined sx={{ fontSize: 40 }} />
                        <Typography variant="h6" gutterBottom>For Donors</Typography>
                        <Typography variant="body2">
                          Detailed reports on food donated, tax deduction documentation, and environmental impact metrics.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', bgcolor: 'info.light', color: 'white' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <BarChartOutlined sx={{ fontSize: 40 }} />
                        <Typography variant="h6" gutterBottom>For Recipients</Typography>
                        <Typography variant="body2">
                          Tracking of incoming donations, meals served, and community impact metrics for grant reporting.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', bgcolor: 'secondary.light', color: 'white' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <BarChartOutlined sx={{ fontSize: 40 }} />
                        <Typography variant="h6" gutterBottom>For Community</Typography>
                        <Typography variant="body2">
                          Public dashboards showing collective impact: food rescued, meals served, CO2 emissions avoided.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <CardMedia
                  component="img"
                  sx={{ maxHeight: 300, objectFit: 'contain', my: 2 }}
                  image="/api/placeholder/600/300"
                  alt="Impact tracking dashboard"
                />
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </Box>

      {/* Special Features */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Special Features
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', mb: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image="/api/placeholder/600/200"
                alt="Food safety icon"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Food Safety Protocols
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Our platform integrates food safety guidelines at every step:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Temperature monitoring during transport" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Food handling best practices" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Expiration date tracking" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Allergen information management" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', mb: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image="/api/placeholder/600/200"
                alt="Donation matching icon"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Smart Donation Matching
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Our AI-powered system matches donations to recipient needs:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Preference-based matching algorithms" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Location optimization to reduce transportation time" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Handling capacity consideration" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                    <ListItemText primary="Special dietary needs consideration" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Benefits for All Participants
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  <StorefrontOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                  For Food Donors
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Reduce food waste disposal costs" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Potential tax benefits for donations" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Improved sustainability metrics" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Enhanced community goodwill" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Simplified donation process" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: 'secondary.light', color: 'white' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  <GroupsOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                  For Recipient Organizations
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Consistent access to quality food" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Reduced food procurement costs" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Greater variety of food options" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Streamlined logistics" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Detailed impact reporting" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  <VolunteerActivismOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
                  For Communities
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Reduced food insecurity" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Decreased landfill waste" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Lower greenhouse gas emissions" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Volunteer engagement opportunities" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleOutline sx={{ color: 'white' }} /></ListItemIcon>
                    <ListItemText primary="Stronger community connections" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Frequently Asked Questions
        </Typography>
        
        <Grid container spacing={3}>
          {[
            {
              question: "What types of food can be donated?",
              answer: "We accept a wide variety of food items including fresh produce, prepared meals, dairy products, bakery items, canned goods, and more. Our platform helps ensure that food safety guidelines are followed for all donations."
            },
            {
              question: "How do we ensure food safety?",
              answer: "Our system incorporates food safety protocols at every step, including temperature monitoring, handling guidelines, and expiration date tracking. All recipient organizations are trained in proper food safety practices."
            },
            {
              question: "What are the liability protections for donors?",
              answer: "Food donors are protected under the Bill Emerson Good Samaritan Food Donation Act, which provides liability protection for food donated in good faith. Our platform also includes documentation to support these protections."
            },
            {
              question: "How can I start donating food?",
              answer: "Simply sign up as a food donor on our platform, complete a brief onboarding process, and you can begin listing available donations. Our team will guide you through the process and answer any questions."
            },
            {
              question: "How can organizations receive food donations?",
              answer: "Qualified nonprofit organizations can register as recipients on our platform. After a verification process, you'll be able to view and claim available donations that match your needs."
            },
            {
              question: "Can individuals volunteer as drivers?",
              answer: "Yes! We welcome volunteer drivers who can help transport food from donors to recipients. You can sign up through our platform and choose delivery opportunities that fit your schedule."
            }
          ].map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h3">
                    {faq.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Get Started Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Paper sx={{ p: 4, bgcolor: 'primary.light', color: 'white', borderRadius: 2 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Join Our Food Rescue Network?
          </Typography>
          <Typography variant="body1" paragraph>
            Whether you're a food business with surplus, an organization serving those in need, 
            or a community member who wants to help, we have a place for you in our ecosystem.
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item>
              <Button 
                variant="contained" 
                size="large" 
                color="secondary" 
                startIcon={<StorefrontOutlined />
                }
                  component={RouterLink} to="/signup"
              >
                Become a Donor
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" size="large" 
                color="secondary" 
                startIcon={<GroupsOutlined />
                }
                 component={RouterLink} to="/signup"
              >
                Register as Recipient
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                size="large" 
                color="secondary" 
                startIcon={<DeliveryDiningOutlined />
                }
                 component={RouterLink} to="/signup"
              >
                Become a  Volunteer
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Impact Stats */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Our Impact So Far
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h3" color="primary">250k+</Typography>
              <Typography variant="h6">Meals Rescued</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h3" color="primary">125+</Typography>
              <Typography variant="h6">Partner Businesses</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h3" color="primary">75+</Typography>
              <Typography variant="h6">Recipient Organizations</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h3" color="primary">40+</Typography>
              <Typography variant="h6">Tons CO₂ Avoided</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          What Our Partners Say
        </Typography>
        
        <Grid container spacing={4}>
          {[
            {
              quote: "This platform has transformed how we handle surplus food. What used to be a burden is now an opportunity to help our community.",
              author: "Sarah Chen",
              title: "Store Manager, FreshMart Grocery"
            },
            {
              quote: "The streamlined process makes it easy for us to access quality food donations that help us serve more people in need.",
              author: "Marcus Johnson",
              title: "Director, Community Food Bank"
            },
            {
              quote: "As a volunteer driver, I've seen firsthand how this platform connects businesses with community organizations efficiently.",
              author: "Elena Rodriguez",
              title: "Volunteer Driver"
            }
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                    "{testimonial.quote}"
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {testimonial.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h2" gutterBottom align="center">
          Have Questions?
        </Typography>
        
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <PhoneOutlined color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Call Us</Typography>
              <Typography variant="body1">(555) 123-4567</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <ScheduleOutlined color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Business Hours</Typography>
              <Typography variant="body1">Monday-Friday: 9am-5pm</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Button variant="contained" color="primary" size="large">
                Contact Us
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HowItWorksPage;
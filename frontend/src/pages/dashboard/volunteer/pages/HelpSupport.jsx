// import React from 'react';
// // Import MUI Icons instead of Heroicons
// import {
//   HelpOutline as QuestionMarkCircleIcon, // Using HelpOutline for QuestionMarkCircle
//   PhoneOutlined as PhoneIcon,             // Using PhoneOutlined for Phone
//   EmailOutlined as EnvelopeIcon,           // Using EmailOutlined for Envelope
//   FeedbackOutlined as ChatBubbleLeftEllipsisIcon // Using FeedbackOutlined for ChatBubbleLeftEllipsis
// } from '@mui/icons-material';

// const HelpSupport = () => {
//   return (
//     <div className="space-y-6">
//       {/* FAQs */}
//       <div className="bg-white p-6 rounded-2xl shadow-md">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//           {/* Use MUI Icon component */}
//           <QuestionMarkCircleIcon className="h-6 w-6 mr-2 text-primary" />
//           Frequently Asked Questions (FAQs)
//         </h2>
//         <div className="space-y-2 text-sm">
//           <details className="group">
//             <summary className="cursor-pointer font-medium text-gray-700 group-hover:text-gray-900">How do I claim a task?</summary>
//             <p className="mt-1 text-gray-600 pl-4">Navigate to the 'Available Tasks' section...</p>
//           </details>
//           <details className="group">
//             <summary className="cursor-pointer font-medium text-gray-700 group-hover:text-gray-900">What if I have an issue during pickup/delivery?</summary>
//             <p className="mt-1 text-gray-600 pl-4">Please use the emergency contact information below...</p>
//           </details>
//           {/* Add more FAQs */}
//         </div>
//       </div>

//       {/* Contact Info */}
//        <div className="bg-white p-6 rounded-2xl shadow-md">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
//          <div className="space-y-2 text-sm text-gray-700">
//             {/* Use MUI Icon component */}
//             <p className="flex items-center"><PhoneIcon className="h-5 w-5 mr-2 text-gray-500" /> Emergency Contact: <span className="ml-1 font-medium">1-800-RESCUE-NOW</span></p>
//             {/* Use MUI Icon component */}
//             <p className="flex items-center"><EnvelopeIcon className="h-5 w-5 mr-2 text-gray-500" /> Support Email: <a href="mailto:support@foodrescue.org" className="ml-1 text-primary hover:underline">support@foodrescue.org</a></p>
//          </div>
//       </div>

//       {/* Feedback Form */}
//       <div className="bg-white p-6 rounded-2xl shadow-md">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//            {/* Use MUI Icon component */}
//            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 mr-2 text-primary" />
//            Feedback / Report an Issue
//         </h2>
//         <form className="space-y-4">
//           <div>
//             <label htmlFor="feedback-type" className="block text-sm font-medium text-gray-700">Type</label>
//             <select id="feedback-type" name="feedback-type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
//               <option>General Feedback</option>
//               <option>Report Issue with Task</option>
//               <option>App Bug Report</option>
//               <option>Suggestion</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="feedback-comments" className="block text-sm font-medium text-gray-700">Comments</label>
//             <textarea id="feedback-comments" name="feedback-comments" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="Please provide details..."></textarea>
//           </div>
//           <div>
//             <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
//               Submit Feedback
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default HelpSupport;


import React, { useState } from 'react';
import {
  HelpOutline as QuestionMarkCircleIcon,
  PhoneOutlined as PhoneIcon,
  EmailOutlined as EnvelopeIcon,
  FeedbackOutlined as ChatBubbleLeftEllipsisIcon,
  ErrorOutline as ErrorIcon,
  CheckCircleOutline as SuccessIcon,
} from '@mui/icons-material';
import {
  Box, Typography, Paper, Stack, Accordion, AccordionSummary, AccordionDetails,
  TextField, MenuItem, Button, CircularProgress, Alert, Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../../../services/api'; // Adjust path as needed

// FAQ Data (can be fetched from backend if dynamic)
const faqs = [
  {
    id: 'faq1',
    question: 'How do I claim a task?',
    answer: 'Navigate to the "Available Tasks" section. Review the task details like location, time, and items. If it fits your availability, click the "Claim Task" button. The task will then move to your "Upcoming Tasks" list.',
  },
  {
    id: 'faq2',
    question: 'What if I have an issue during pickup/delivery?',
    answer: 'If it\'s an emergency or you need immediate assistance, please use the Emergency Contact number provided below. For non-urgent issues or feedback about the task, you can use the feedback form on this page after completing the task.',
  },
  {
    id: 'faq3',
    question: 'How is my volunteer time tracked?',
    answer: 'Your time is estimated based on the tasks you complete. Ensure you mark tasks as "Started" and "Completed" in the app for accurate tracking. Detailed time logs might be available in future updates.',
  },
  // Add more FAQs as needed
];

const HelpSupport = () => {
  const [feedbackType, setFeedbackType] = useState('General Feedback');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' }); // 'success' or 'error'

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setSubmitting(true);
    setSubmitStatus({ type: '', message: '' }); // Clear previous status

    try {
      // Assuming an endpoint like /api/support/feedback or similar
      await api.post('/support/feedback', {
        type: feedbackType,
        message: comments,
        // Optionally include user info if backend doesn't get it from auth token
        // userId: currentUser.id,
        // userRole: 'volunteer'
      });

      setSubmitStatus({ type: 'success', message: 'Feedback submitted successfully! Thank you.' });
      // Clear the form
      setFeedbackType('General Feedback');
      setComments('');

    } catch (err) {
      console.error("Error submitting feedback:", err);
      setSubmitStatus({ type: 'error', message: err.response?.data?.message || 'Failed to submit feedback. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      {/* FAQs */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" mb={2}>
          <QuestionMarkCircleIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Frequently Asked Questions (FAQs)</Typography>
        </Stack>
        {faqs.map((faq) => (
          <Accordion key={faq.id} elevation={0} disableGutters sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid', borderColor: 'divider' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Contact Info */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>Contact Information</Typography>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2">Emergency Contact:</Typography>
            <Typography variant="body2" fontWeight="medium">1-800-RESCUE-NOW</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <EnvelopeIcon fontSize="small" color="action" />
            <Typography variant="body2">Support Email:</Typography>
            <Link href="mailto:support@foodrescue.org" variant="body2" underline="hover">
              support@foodrescue.org
            </Link>
          </Stack>
        </Stack>
      </Paper>

      {/* Feedback Form */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" mb={2}>
          <ChatBubbleLeftEllipsisIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Feedback / Report an Issue</Typography>
        </Stack>
        <Box component="form" onSubmit={handleFeedbackSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Feedback Type"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              variant="outlined"
              size="small"
            >
              <MenuItem value="General Feedback">General Feedback</MenuItem>
              <MenuItem value="Report Issue with Task">Report Issue with Task</MenuItem>
              <MenuItem value="App Bug Report">App Bug Report</MenuItem>
              <MenuItem value="Suggestion">Suggestion</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Comments"
              multiline
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="Please provide details..."
            />

            {submitStatus.message && (
              <Alert
                severity={submitStatus.type} // 'success' or 'error'
                icon={submitStatus.type === 'success' ? <SuccessIcon fontSize="inherit" /> : <ErrorIcon fontSize="inherit" />}
              >
                {submitStatus.message}
              </Alert>
            )}

            <Box sx={{ position: 'relative', alignSelf: 'flex-start' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || !comments.trim()} // Disable if submitting or no comments
                sx={{ mt: 1 }}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
              {submitting && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'primary.main',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
};

export default HelpSupport;
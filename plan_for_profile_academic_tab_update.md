Plan for Updating Profile.tsx Academic Information Tab to Fetch Courses and Semesters Dynamically

1. Fetch Courses on Component Mount

   - Use useEffect to fetch all courses from backend API endpoint GET /courses.
   - Store the courses in a new state variable, e.g., courses.
   - Populate the "Current Course" dropdown with these courses instead of hardcoded options.

2. Fetch Semesters When Course Changes

   - Add a useEffect that triggers when the selected course changes.
   - Fetch semesters for the selected course from backend API endpoint GET /semesters/course/:courseId.
   - Store the semesters in a new state variable, e.g., semesters.
   - Populate the "Current Semester" dropdown with these semesters instead of hardcoded 1-12 options.

3. Update Form Data on Dropdown Changes

   - When the user selects a course, update formData.currentCourse.
   - When the user selects a semester, update formData.currentSemester.

4. Handle Initial Profile Load

   - When fetching the user profile, if currentCourse is set, fetch semesters for that course to populate the semester dropdown.
   - Set the currentSemester dropdown value accordingly.

5. UI Changes

   - Replace hardcoded SelectItem options in the Academic Information tab with dynamic mapping from courses and semesters state.
   - Disable dropdowns when not editing.

6. Error Handling and Loading States

   - Add error handling for API calls.
   - Optionally add loading indicators for dropdowns while fetching data.

7. Testing
   - Verify that courses and semesters load correctly.
   - Verify that selecting a course updates semesters dropdown.
   - Verify that profile save updates the backend correctly.

This plan ensures the Academic Information tab shows real data from the backend and updates dynamically based on user selections.

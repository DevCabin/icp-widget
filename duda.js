window.dmAPI.runOnReady('iClassProWidget', () => {
    const container = element.querySelector('.iclasspro-widget');
    const classesGrid = container.querySelector('#classesGrid');
    const loadingState = container.querySelector('#loadingState');
    const errorState = container.querySelector('#errorState');
    const errorDescription = container.querySelector('#errorDescription');
    const setupInstructions = container.querySelector('#setupInstructions');
    const retryBtn = container.querySelector('#retryBtn');
    
    // Get configuration
    const account = data.config['accountName'] || 'demo';
    const proxyUrl = 'https://icp-widget.vercel.app/api/iclasspro'; // Hard coded working proxy URL
    const maxClasses = parseInt(data.config['maxClasses']) || 10;
    
    // Display options - all toggleable
    const showTime = data.config['showTime'] !== false;
    const showInstructor = data.config['showInstructor'] !== false;
    const showDescription = data.config['showDescription'] !== false;
    const showPrice = data.config['showPrice'] !== false;
    const showAgeGroup = data.config['showAgeGroup'] !== false;
    const showCapacity = data.config['showCapacity'] !== false;
    const showSchedule = data.config['showSchedule'] !== false;
    const showEnrollButton = data.config['showEnrollButton'] !== false;
    
    // Demo data for fallback - Children's Swim Classes
    const demoClasses = [
      {
        id: '1',
        name: 'Water Babies (Parent & Me)',
        instructor: 'Sarah Martinez',
        time: '10:00 AM - 10:30 AM',
        date: 'Monday & Wednesday',
        description: 'Gentle introduction to water for infants and toddlers with parent participation. Focus on water comfort and basic floating.',
        ageGroup: 'Ages 6 months - 2 years',
        capacity: 8,
        enrolled: 6,
        price: '$65/month'
      },
      {
        id: '2', 
        name: 'Beginner Swimmers',
        instructor: 'Coach Mike Thompson',
        time: '4:00 PM - 4:30 PM',
        date: 'Tuesday & Thursday',
        description: 'Learn basic water safety, floating, and beginning stroke techniques. Small class sizes for personalized attention.',
        ageGroup: 'Ages 3-5',
        capacity: 6,
        enrolled: 5,
        price: '$75/month'
      },
      {
        id: '3',
        name: 'Stroke Development',
        instructor: 'Lisa Chen',
        time: '5:00 PM - 5:45 PM', 
        date: 'Monday, Wednesday & Friday',
        description: 'Perfect freestyle and backstroke techniques. Introduction to breaststroke and butterfly for advanced swimmers.',
        ageGroup: 'Ages 6-8',
        capacity: 10,
        enrolled: 9,
        price: '$85/month'
      },
      {
        id: '4',
        name: 'Competitive Prep',
        instructor: 'Coach David Park',
        time: '6:00 PM - 7:00 PM',
        date: 'Monday through Friday',
        description: 'Advanced technique refinement, endurance building, and race preparation for competitive swimmers.',
        ageGroup: 'Ages 9-12',
        capacity: 12,
        enrolled: 10,
        price: '$120/month'
      },
      {
        id: '5',
        name: 'Water Safety & Survival',
        instructor: 'Emma Rodriguez',
        time: '3:00 PM - 3:30 PM',
        date: 'Saturday',
        description: 'Essential water safety skills including treading water, floating, and emergency response techniques.',
        ageGroup: 'Ages 5-10',
        capacity: 8,
        enrolled: 7,
        price: '$45/month'
      }
    ];
    
    async function fetchClasses() {
      showLoading();
      
      try {
        const url = `${proxyUrl}?account=${encodeURIComponent(account)}`;
        console.log('Fetching classes from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('API response:', result);
          
          // Handle different data structures
          let classes = Array.isArray(result) ? result : 
                       result.data ? result.data : 
                       result.classes ? result.classes : [];
          
          if (classes.length > 0) {
            renderClasses(classes.slice(0, maxClasses));
            hideError();
            return;
          }
        } else {
          console.log('API response not OK:', response.status, response.statusText);
        }
      } catch (error) {
        console.log('API request failed:', error);
      }
      
      // If API fails, show error and then demo data
      showError();
    }
    
    function showLoading() {
      loadingState.classList.remove('hidden');
      errorState.classList.add('hidden');
      classesGrid.classList.add('hidden');
    }
    
    function hideError() {
      loadingState.classList.add('hidden');
      errorState.classList.add('hidden');
      classesGrid.classList.remove('hidden');
    }
    
    function showError() {
      loadingState.classList.add('hidden');
      classesGrid.classList.add('hidden');
      errorState.classList.remove('hidden');
      
      errorDescription.textContent = 'Could not connect to iClassPro API. Showing demo data...';
      setupInstructions.classList.add('hidden');
      
      // Show demo data after 3 seconds
      setTimeout(() => {
        console.log('Showing demo data as fallback');
        renderClasses(demoClasses.slice(0, maxClasses));
        hideError();
        
        // Add demo notice
        const notice = document.createElement('div');
        notice.className = 'demo-notice';
        notice.innerHTML = `
          <strong>Demo Mode:</strong> Showing sample swim classes. 
          Configure your iClassPro account name in the widget settings to load live data.
        `;
        classesGrid.insertBefore(notice, classesGrid.firstChild);
      }, 3000);
    }
    
    function renderClasses(classes) {
      if (!classes || classes.length === 0) {
        classesGrid.innerHTML = '<p class="no-classes">No classes available at the moment.</p>';
        return;
      }
      
      const classItems = classes.map(classItem => {
        // Normalize field names from different possible API structures
        const name = classItem.name || classItem.className || classItem.title || 'Unnamed Class';
        const instructor = classItem.instructor || classItem.instructorName || classItem.teacher || '';
        const time = classItem.time || classItem.startTime || classItem.schedule || '';
        const date = classItem.date || classItem.day || classItem.days || '';
        const description = classItem.description || classItem.details || '';
        const capacity = classItem.capacity || classItem.maxStudents || classItem.max_enrollment || 0;
        const enrolled = classItem.enrolled || classItem.currentStudents || classItem.current_enrollment || 0;
        const price = classItem.price || classItem.cost || classItem.fee || classItem.tuition || '';
        const ageGroup = classItem.ageGroup || classItem.ages || classItem.age_range || '';
        const id = classItem.id || classItem.classId || classItem.class_id || Math.random().toString(36).substr(2, 9);
        
        const enrollmentPercentage = capacity > 0 ? (enrolled / capacity) * 100 : 0;
        const isNearlyFull = enrollmentPercentage >= 80;
        const isFull = enrolled >= capacity && capacity > 0;
        
        return `
          <article class="class-card" data-class-id="${id}">
            <header class="class-header">
              <h3 class="class-name">${name}</h3>
              ${showPrice && price ? `<span class="class-price">${price}</span>` : ''}
            </header>
            
            ${showAgeGroup && ageGroup ? `<div class="age-group">${ageGroup}</div>` : ''}
            
            <div class="class-details">
              ${showInstructor && instructor ? `<p class="class-instructor"><strong>Instructor:</strong> ${instructor}</p>` : ''}
              
              ${(showTime || showSchedule) && (time || date) ? `
              <div class="class-schedule">
                ${showTime && time ? `<p class="class-time"><strong>Time:</strong> ${time}</p>` : ''}
                ${showSchedule && date ? `<p class="class-date"><strong>Days:</strong> ${date}</p>` : ''}
              </div>
              ` : ''}
              
              ${showDescription && description ? `<p class="class-description">${description}</p>` : ''}
            </div>
            
            ${showCapacity && capacity > 0 ? `
            <div class="class-capacity">
              <p class="capacity-text ${isNearlyFull ? 'nearly-full' : ''} ${isFull ? 'full' : ''}">
                ${enrolled}/${capacity} enrolled
                ${isFull ? ' - FULL' : isNearlyFull ? ' - Almost Full' : ''}
              </p>
              <div class="capacity-bar">
                <div class="capacity-fill ${isFull ? 'full' : isNearlyFull ? 'nearly-full' : ''}" 
                     style="width: ${Math.min(enrollmentPercentage, 100)}%"></div>
              </div>
            </div>
            ` : ''}
            
            ${showEnrollButton ? `
            <button class="enroll-btn ${isFull ? 'full' : ''}" ${isFull ? 'disabled' : ''} 
                    data-class-id="${id}" data-class-name="${name}">
              ${isFull ? 'Class Full' : 'Enroll Now'}
            </button>
            ` : ''}
          </article>
        `;
      }).join('');
      
      classesGrid.innerHTML = classItems;
      
      // Add click handlers for enroll buttons if they're shown
      if (showEnrollButton) {
        const enrollBtns = classesGrid.querySelectorAll('.enroll-btn:not([disabled])');
        enrollBtns.forEach(btn => {
          btn.addEventListener('click', handleEnrollment);
        });
      }
    }
    
    function handleEnrollment(e) {
      const btn = e.target;
      const classId = btn.dataset.classId;
      const className = btn.dataset.className;
      
      // Redirect to iClassPro enrollment
      const baseUrl = `https://portal.iclasspro.com/${account}`;
      const enrollUrl = `${baseUrl}/enroll/${classId}`;
      const fallbackUrl = `${baseUrl}/classes`;
      
      try {
        window.open(enrollUrl, '_blank');
      } catch (error) {
        console.log('Fallback to classes page');
        window.open(fallbackUrl, '_blank');
      }
    }
    
    // Event listeners
    if (retryBtn) {
      retryBtn.addEventListener('click', fetchClasses);
    }
    
    // Initialize the widget
    fetchClasses();
  });
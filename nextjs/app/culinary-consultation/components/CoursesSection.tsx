interface Course {
  name: string;
  price: string;
  duration: string;
  level: string;
  included: string;
}

interface CoursesSectionProps {
  coursesLabel: string;
  coursesHeading: string;
  coursesSubheading: string;
  tableCourse: string;
  tablePrice: string;
  tableDuration: string;
  tableLevel: string;
  tableIncluded: string;
  course1Name: string;
  course1Price: string;
  course1Duration: string;
  course1Level: string;
  course1Included: string;
  course2Name: string;
  course2Price: string;
  course2Duration: string;
  course2Level: string;
  course2Included: string;
  course3Name: string;
  course3Price: string;
  course3Duration: string;
  course3Level: string;
  course3Included: string;
}

export default function CoursesSection(props: CoursesSectionProps) {
  const courses: Course[] = [
    {
      name: props.course1Name,
      price: props.course1Price,
      duration: props.course1Duration,
      level: props.course1Level,
      included: props.course1Included,
    },
    {
      name: props.course2Name,
      price: props.course2Price,
      duration: props.course2Duration,
      level: props.course2Level,
      included: props.course2Included,
    },
    {
      name: props.course3Name,
      price: props.course3Price,
      duration: props.course3Duration,
      level: props.course3Level,
      included: props.course3Included,
    },
  ];

  return (
    <section id="courses" className="py-12 md:py-16 bg-light">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-secondary uppercase tracking-widest text-sm mb-4 font-medium">
            {props.coursesLabel}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {props.coursesHeading}
          </h2>
          <p className="text-muted max-w-2xl mx-auto">{props.coursesSubheading}</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-light">
                <th className="px-6 py-4 text-left font-bold w-1/6">{props.tableCourse}</th>
                <th className="px-6 py-4 text-left font-bold w-1/12">{props.tablePrice}</th>
                <th className="px-6 py-4 text-left font-bold w-1/12">{props.tableDuration}</th>
                <th className="px-6 py-4 text-left font-bold w-1/2">{props.tableIncluded}</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={index}
                  className={`border-b border-primary/10 ${
                    index % 2 === 0 ? 'bg-light' : 'bg-light/50'
                  } hover:bg-secondary/10 transition-colors`}
                >
                  <td className="px-6 py-4 font-bold text-primary">{course.name}</td>
                  <td className="px-6 py-4 text-muted">{course.price}</td>
                  <td className="px-6 py-4 text-muted">{course.duration}</td>
                  <td className="px-6 py-4 text-muted text-sm">
                    <div className="space-y-1">
                      {course.included.split('•').filter(b => b.trim()).map((benefit, idx) => (
                        <div key={idx}>• {benefit.trim()}</div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-6">
          {courses.map((course, index) => (
            <div key={index} className="bg-light p-6 border-2 border-primary/10">
              <h3 className="text-xl font-bold text-primary mb-4">{course.name}</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-bold text-primary">{props.tablePrice}:</span>
                  <span className="text-muted ml-2">{course.price}</span>
                </div>
                <div>
                  <span className="font-bold text-primary">{props.tableDuration}:</span>
                  <span className="text-muted ml-2">{course.duration}</span>
                </div>
                <div>
                  <span className="font-bold text-primary block mb-2">{props.tableIncluded}:</span>
                  <div className="space-y-1 text-muted text-sm">
                    {course.included.split('•').filter(b => b.trim()).map((benefit, idx) => (
                      <div key={idx}>• {benefit.trim()}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export interface LinkedInCertificate {
  title: string;
  issuer: string;
  issued: string;
  url: string;
}

export interface LinkedInPost {
  title: string;
  url: string;
  comments: number;
}

export const linkedinCertificates: LinkedInCertificate[] = [
  {
    title: "AWS Educate Getting Started with Storage",
    issuer: "Amazon Web Services (AWS)",
    issued: "Feb 2025",
    url: "https://www.credly.com/badges/97ff6cf4-9eb1-4bbc-a05e-bf6f3a94201a",
  },
  {
    title: "AWS Educate Introduction to Cloud 101",
    issuer: "Amazon Web Services (AWS)",
    issued: "Feb 2025",
    url: "https://www.linkedin.com/in/chathumi-perera-/details/certifications/",
  },
  {
    title: "Describe cloud service types",
    issuer: "Microsoft Learning",
    issued: "Feb 2025",
    url: "https://learn.microsoft.com/api/achievements/share/en-us/chathumisanchanaperera-3160/WZCMBK6N?sharingId=1D2C63017A7EAE82",
  },
  {
    title: "Microsoft Azure Fundamentals: Describe cloud concepts",
    issuer: "Microsoft Learning",
    issued: "Feb 2025",
    url: "https://www.linkedin.com/in/chathumi-perera-/details/certifications/",
  },
  {
    title: "AWS for Beginners",
    issuer: "Great Learning",
    issued: "May 2024",
    url: "https://www.linkedin.com/in/chathumi-perera-/details/certifications/",
  },
  {
    title: "Python 101 for Data Science",
    issuer: "IBM",
    issued: "2024",
    url: "https://www.linkedin.com/in/chathumi-perera-/details/certifications/",
  },
  {
    title: "Python for Data Science",
    issuer: "IBM",
    issued: "2024",
    url: "https://www.linkedin.com/in/chathumi-perera-/details/certifications/",
  },
  {
    title: "SQL and Relational Databases 101",
    issuer: "IBM",
    issued: "2024",
    url: "https://www.linkedin.com/in/chathumi-perera-/details/certifications/",
  },
  {
    title: "Python for Beginners",
    issuer: "University of Moratuwa",
    issued: "2024",
    url: "https://www.linkedin.com/in/chathumi-perera-/details/certifications/",
  },
  {
    title: "Web Design for Beginners",
    issuer: "University of Moratuwa",
    issued: "2024",
    url: "https://www.linkedin.com/in/chathumi-perera-/details/certifications/",
  },
  {
    title: "Foundations of Project Management",
    issuer: "University of Moratuwa CODL",
    issued: "May 2025",
    url: "https://www.linkedin.com/posts/chathumi-perera-_uom-uomcodl-projectmanagement-activity-7325643084241739776-_jfQ",
  },
];

export const linkedinPosts: LinkedInPost[] = [
  {
    title: "First Medium article — SQL Server to Cloud ETL",
    url: "https://www.linkedin.com/posts/chathumi-perera-_from-sql-server-to-cloud-etl-my-beginner-activity-7402413602835767296--X-n",
    comments: 1,
  },
  {
    title: "Data Science internship completed at Sampath Bank PLC",
    url: "https://www.linkedin.com/posts/chathumi-perera-_internshipcompleted-datascienceintern-activity-7413932244052041728-0UWv",
    comments: 2,
  },
];

export function getLinkedInCertificateCount(): number {
  return linkedinCertificates.length;
}

export function getLinkedInCommentCount(): number {
  return linkedinPosts.reduce((sum, post) => sum + post.comments, 0);
}

  export interface Question {
    label: string;
    name: string;
    id: string;
    intro?: string;
  }

  export interface PackageQuestion extends Question {
    type: "package";
    choices: string[];
    choiceDescriptions: string[];
  }

  export interface MultipleChoiceQuestion extends Question {
    type: "multiple-choice";
    choices: string[];
  }

  export interface RadioQuestion extends Question {
    type: "radio";
    choices: string[];
  }

  export interface TextQuestion extends Question {
    type: "text" | "long-text"
  }

  export const questions: (
    | Question
    &( PackageQuestion
    | MultipleChoiceQuestion
    | RadioQuestion
    | TextQuestion)
  )[] = [
    {
      label: "Let’s begin with your name. What might I call you?",
      name: "Name",
      id: "name",
      type: "text",
    },
    {
      label: "What is the best way to contact you? Email, Phone, or Text? (Please provide the \
associated contact information. I’m good, but not that good.)",
      name: "Contact",
      id: "contact",
      type: "text",
    },
    {
      label: "Let’s begin with genre. Please choose any that apply to your book.",
      name: "Genre",
      id: "genre",
      type: "multiple-choice",
      choices: [
        "Theology",
        "Spirituality",
        "Self-Help",
        "History",
        "Biography",
        "Autobiography",
        "Medical",
        "Journalistic",
        "or Other",
      ],
    },
    {
      label: "What stage in the process are you? Don’t feel the need to explain it all here. Just a few \
words about whether you are just beginning, or you already have 100K words written. This will help \
me understand how I can best support you as you bring this book to fruition.",
      name: "Stage",
      id: "stage",
      type: "long-text",
    },
    {
      label: "If you’re willing, explain what brought you to me. If you’re just curious, or unsure where \
to begin, feel free to say that! Anything here helps me make sure I give you the best assistance I can.",
      name: "Why",
      id: "why",
      type: "long-text",
    },
    {
      label: "Which package would you like to choose? This can be subject to change, but it will give us \
both a good starting point.",
      name: "Package",
      id: "package",
      type: "package",
      intro:
        "My work is highly versatile. I can adapt to whatever project, stage of development, or level of \
collaboration you’re most comfortable with. I offer three packages:",
      choices: ["Hourly consultations", "Milestones", "Director's Package"],
      choiceDescriptions: [
        "This is for authors who already have most of the book done but feel stuck or need help editorializing. \
It can also support early brainstorming or help with highly specific issues your manuscript or concepts \
might need. It’s extremely flexible, and you pay for what you need. My hourly rate is <strong>$65</strong> \
and includes nearly a decade of professional experience, resources, hard-won wisdom, and the option to \
meet in person or online, should you choose. If you only need a 30-minute session, that will cost \
<strong>$35.</strong>",
      ],
    },
    {
      label: "Can you do an in-person meeting at a coffee shop or pub of your choosing?",
      name: "Inperson",
      id: "inperson",
      type: "radio",
      intro:
        "I prefer to meet in person over coffee or a good ale for the first meeting, just so that you can see \
that I’m not AI, and so that we can begin to forge your book ideas together. The following meetings will \
usually be online, unless otherwise requested. I am based out of Corvallis, OR, but can meet as far as \
Albany, Salem, Eugene, or anywhere else within a hundred-mile radius. If you are beyond those boundaries, \
we’ll just bring our own coffee or ale to our first virtual meeting!",
        choices: ["Yes", "No"]
    },
    {
      label: "What time zone are you in, and what are some dates and times that work for you to meet, either \
virtually or in-person? Please give me at least 3 options.",
      name: "Scheduling",
      id: "scheduling",
      type: "text",
    },
    {
      label: "Are you okay if I use your book and/or reviews on my website and social media for promotion?",
      name: "Right to Use",
      id: "righttouse",
      type: "radio",
      choices: ["I'm good with both!", "Only Book.", "Only Reviews."]
    },
  ];
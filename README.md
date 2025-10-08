# Smart Library Assistant

The Smart Library Assistant is a Next.js web application that provides an AI-powered search and discovery experience for institutional libraries. This project demonstrates how modern AI techniques like Retrieval-Augmented Generation (RAG) can be used to create a more intuitive and powerful search experience, allowing users to find books based on concepts and topics, not just exact titles or authors.

## About The Project

Traditional library search systems are often rigid and require users to know the exact title or author of a book. This can be a frustrating experience for users who are exploring a new topic or are unsure of what they are looking for.

The Smart Library Assistant solves this problem by using AI to understand the *concepts* and *topics* within books, not just their metadata. This allows users to ask vague, conversational questions and still get relevant results. For example, a user could ask, "Do you have any books about the military tactics of ancient Rome?" and the assistant would be able to recommend relevant books, even if those exact words don't appear in the title.

This project is a proof-of-concept that demonstrates the power of Retrieval-Augmented Generation (RAG) in a real-world application. It is designed for institutional libraries, such as those at universities, colleges, and other large organizations, that want to provide their users with a more intelligent and intuitive search experience.

### Key Features

*   **AI-Powered Search:** Uses a RAG pipeline to understand the user's intent and find the most relevant books.
*   **Natural Language Chat:** Users can ask questions in plain language, just as they would with a human librarian.
*   **CSV Data Onboarding:** Institutions can easily upload their book collection via a CSV file.
*   **Dynamic Dashboard:** Provides an overview of the library's stats, including the total number of books ingested.
*   **User Authentication:** Uses Clerk for secure user authentication and management.
*   **Simple Integration:** Designed to be easily embedded into an existing library website.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18.17.0 or later)
*   [pnpm](https://pnpm.io/) (or your preferred package manager)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/ai-library.git
    ```
2.  Install packages
    ```sh
    pnpm install
    ```
3.  Set up your environment variables. Create a `.env.local` file in the root of the project and add the following:
    ```env
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    CLERK_WEBHOOK_SECRET=

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY=
    ```
4.  Run the development server
    ```sh
    pnpm dev
    ```

## Tech Stack

*   [Next.js](https://nextjs.org/) - React framework for building the web application.
*   [React](https://reactjs.org/) - JavaScript library for building user interfaces.
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for styling.
*   [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS.
*   [Clerk](https://clerk.com/) - User authentication and management.
*   [Supabase](https://supabase.com/) - Open source Firebase alternative for the database and backend.
*   [pnpm](https://pnpm.io/) - Fast, disk space-efficient package manager.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m '''Add some AmazingFeature'''`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Fredrick M. Morara - [@your_twitter](https://twitter.com/your_twitter) - momanyifredm@gmail.com

Project Link: [https://github.com/your_username/ai-library](https://github.com/your_username/ai-library)
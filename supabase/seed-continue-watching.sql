insert into "MovieData" ("id", "tmdb_id", "title", "backdrop_path", "budget", "genres", "imdb_id", "original_languages", "overview", "popularity", "poster_path", "production_companies", "release_date", "revenue", "runtime", "status", "vote_average", "vote_count")
values
  (687163, 687163, 'Project Hail Mary', '/8Tfys3mDZVp4tNoH2ktm06a0Tau.jpg', 200000000, 'Science Fiction, Adventure', null, 'en', 'Science teacher Ryland Grace wakes up on a spaceship light years from home with no recollection of who he is or how he got there. As his memory returns, he begins to uncover his mission: solve the riddle of the mysterious substance causing the sun to die out. He must call on his scientific knowledge and unorthodox ideas to save everything on Earth from extinction.', 369, '/yihdXomYb5kTeSivtFndMy5iDmf.jpg', 'Lord Miller, Amazon MGM Studios, Pascal Pictures, Open Invite Entertainment, Waypoint Entertainment', '2026-03-15', 656302282, 157, 'Released', 8.405, 2625),
  (264660, 264660, 'Ex Machina', '/uqOuJ50EtTj7kkDIXP8LCg7G45D.jpg', 15000000, 'Drama, Science Fiction', null, 'en', 'Caleb, a coder at the world''s largest internet company, wins a competition to spend a week at a private mountain retreat belonging to Nathan, the reclusive CEO of the company. But when Caleb arrives at the remote location he finds that he will have to participate in a strange and fascinating experiment in which he must interact with the world''s first true artificial intelligence, housed in the body of a beautiful robot girl.', 8, '/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg', 'DNA Films, Film4 Productions, IAC Films, Scott Rudin Productions', '2015-01-21', 36869414, 108, 'Released', 7.573, 14212),
  (1895, 1895, 'Star Wars: Episode III - Revenge of the Sith', '/jniabJVBSW3EqLlyhjxWCZjVkiE.jpg', 113000000, 'Adventure, Action, Science Fiction', null, 'en', 'When the sinister Sith unveil a thousand-year-old plot to rule the galaxy, the Republic crumbles and from its ashes rises the evil Galactic Empire. Jedi hero Anakin Skywalker must choose a side.', 11, '/xfSAoBEm9MNBjmlNcDYLvLSMlnq.jpg', 'Lucasfilm Ltd.', '2005-05-17', 850000000, 140, 'Released', 7.465, 14885),
  (157336, 157336, 'Interstellar', '/2ssWTSVklAEc98frZUQhgtGHx7s.jpg', 165000000, 'Adventure, Drama, Science Fiction', null, 'en', 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.', 66, '/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg', 'Legendary Pictures, Syncopy, Lynda Obst Productions', '2014-11-05', 746606706, 169, 'Released', 8.472, 39639),
  (872585, 872585, 'Oppenheimer', '/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg', 100000000, 'Drama, History', null, 'en', 'The story of J. Robert Oppenheimer''s role in the development of the atomic bomb during World War II.', 27, '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 'Syncopy, Universal Pictures, Atlas Entertainment, Breakheart Films, Peters Creek Entertainment', '2023-07-19', 952000000, 181, 'Released', 8.031, 11704),
  (693134, 693134, 'Dune: Part Two', '/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', 190000000, 'Science Fiction, Adventure', null, 'en', 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.', 23, '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', 'Legendary Pictures', '2024-02-27', 714844358, 167, 'Released', 8.126, 7888)
on conflict ("id") do update set
  "tmdb_id" = excluded."tmdb_id",
  "title" = excluded."title",
  "backdrop_path" = excluded."backdrop_path",
  "budget" = excluded."budget",
  "genres" = excluded."genres",
  "imdb_id" = excluded."imdb_id",
  "original_languages" = excluded."original_languages",
  "overview" = excluded."overview",
  "popularity" = excluded."popularity",
  "poster_path" = excluded."poster_path",
  "production_companies" = excluded."production_companies",
  "release_date" = excluded."release_date",
  "revenue" = excluded."revenue",
  "runtime" = excluded."runtime",
  "status" = excluded."status",
  "vote_average" = excluded."vote_average",
  "vote_count" = excluded."vote_count";

/** The artifacts below document design hypotheses and choices visible in the shipped prototypes.
 * They are not descriptions of user interviews, market research, or measured impact.
 */
export type FocusProject = 'clarity-ai' | 'muse';
export type DesignOption = {
  id: string;
  name: string;
  type: 'chat' | 'search' | 'evidence' | 'feed' | 'folders' | 'canvas';
  status: 'Chosen direction' | 'Explored, not selected';
  strength: string;
  weakness: string;
};
export type StudyTask = {id: string; instruction: string; observe: string; success: string};
export type DesignEvidence = {
  title: string;
  audience: string;
  job: string;
  friction: string;
  hypothesis: string;
  scope: string;
  options: DesignOption[];
  workflow: string[];
  tasks: StudyTask[];
  testQuestion: string;
  designerContribution: string[];
  aiRole: string;
  openQuestions: string[];
};
export const focusEvidence: Record<FocusProject, DesignEvidence> = {
  'clarity-ai': {
    title: 'Clarity AI',
    audience: 'Students who need to understand and cross-check source-heavy research.',
    job: 'When I ask a question across several notes, help me trace the answer to an exact source so I can decide whether to trust it.',
    friction: 'A confident-sounding answer can hide the evidence needed to evaluate it. The MVP treats source inspection as a primary action rather than a footnote.',
    hypothesis: 'Keeping answers, citations, and source text in one continuous workspace may help people verify a claim with fewer context switches.',
    scope: 'Working text-source import, evidence retrieval, citation inspection, saved research, and optional server-side synthesis. No PDF extraction or verified accuracy gains.',
    options: [
      {id:'A', name:'Conversation first', type:'chat', status:'Explored, not selected', strength:'Familiar, low-friction way to ask a question.', weakness:'Source checking is easy to miss below a long answer.'},
      {id:'B', name:'Search results first', type:'search', status:'Explored, not selected', strength:'Keeps the original material prominent.', weakness:'Places the synthesis burden on the reader.'},
      {id:'C', name:'Answer + evidence', type:'evidence', status:'Chosen direction', strength:'Connects the response to an inspectable source in the same workspace.', weakness:'Can become dense on small screens; panels need to stack clearly.'}
    ],
    workflow: ['Add text sources', 'Ask a focused question', 'Review evidence or optional AI synthesis', 'Open a citation', 'Save a useful result'],
    tasks: [
      {id:'c1', instruction:'Add a text source and ask a question that the source can answer.', observe:'Where do they first look? Do they understand sample data vs their own sources?', success:'A question is submitted using an imported or pasted source without facilitator guidance.'},
      {id:'c2', instruction:'Find the passage that supports an answer and tell me whether it fully answers your question.', observe:'Can they locate the source and distinguish evidence from interpretation?', success:'They open a supporting passage and explain a limitation, if any.'},
      {id:'c3', instruction:'Save the result, then navigate away and find it again.', observe:'Does the person understand where a saved result lives?', success:'They retrieve the saved result without help.'}
    ],
    testQuestion:'Do the evidence controls help people verify information without losing their place?',
    designerContribution:['Defined source inspection as the primary interaction rather than a secondary citation list.','Designed the question → answer → evidence → save flow.','Implemented responsive panels, source states, evidence-search fallback, and explicit AI boundaries.'],
    aiRole:'AI assistance was used during implementation and prototyping. When a server key is configured, Claude synthesizes excerpts; otherwise the app returns evidence search only. AI was not used to fabricate user quotes, research results, or measured improvements.',
    openQuestions:['Can participants tell source search from AI synthesis?','Which layout best supports citation checking on a phone?','Does saving an answer remain understandable after several questions?']
  },
  muse: {
    title: 'Muse',
    audience: 'Designers, photographers, and creative students collecting references for a specific idea.',
    job: 'When I find a compelling reference, help me turn several saved images into a visual direction with context and notes.',
    friction: 'Saving imagery into a list is easy, but turning a list into a point of view often requires switching tools or starting over.',
    hypothesis: 'A direct transition from discovery to spatial arrangement may help people develop a visual direction without breaking momentum.',
    scope: 'Working searchable library, board creation, locally imported images, movable cards, notes, keyboard nudging and PNG/board-data export. No shared accounts or cloud collaboration.',
    options: [
      {id:'A', name:'Endless inspiration feed', type:'feed', status:'Explored, not selected', strength:'Visually engaging and fast to browse.', weakness:'Encourages collecting without shaping an idea.'},
      {id:'B', name:'Traditional folders', type:'folders', status:'Explored, not selected', strength:'Easy to scan and organize into named groups.', weakness:'Relationships between references stay implicit.'},
      {id:'C', name:'Spatial board studio', type:'canvas', status:'Chosen direction', strength:'Lets references, notes, and grouping become part of the thinking process.', weakness:'Requires drag/keyboard controls and careful mobile behavior.'}
    ],
    workflow: ['Explore a reference', 'Inspect its details', 'Save to a named board', 'Arrange references and notes', 'Export board image and data'],
    tasks: [
      {id:'m1', instruction:'Find a visual that fits a warm, editorial concept and inspect its details.', observe:'Are search, category filters, and visual details discoverable?', success:'They select a reference and locate its title, tags, and attribution.'},
      {id:'m2', instruction:'Create a new moodboard, save two references, and add a note explaining the connection.', observe:'Can they understand the path from Discover to Studio?', success:'A new board contains two images and a note.'},
      {id:'m3', instruction:'Rearrange the board and export it to a file.', observe:'Can they find move/keyboard affordances and interpret the export format?', success:'They reposition an item and download a PNG; editable JSON remains available.'}
    ],
    testQuestion:'Can new users turn collected images into an intentional, editable composition?',
    designerContribution:['Designed separate Discover, Boards, and Studio stages with explicit transitions.','Moved the cover name onto a high-contrast panel after identifying the collision with collage imagery.','Built detail previews, drag interactions, keyboard nudging, local persistence, and JSON export.'],
    aiRole:'AI-assisted coding helped accelerate prototypes and refine components. Muse does not currently include AI image search or generated recommendations, and no participant research or impact metrics are being implied.',
    openQuestions:['Do people notice the Studio action after saving?','Is a freeform board more useful than a grid for this task?','Do participants understand the difference between a shareable PNG and editable JSON?']
  }
};

export function isFocusProject(value: string): value is FocusProject { return value === 'clarity-ai' || value === 'muse'; }

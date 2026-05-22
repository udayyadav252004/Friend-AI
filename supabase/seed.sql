insert into public.profiles (
  id,
  preferred_name,
  goals,
  stress_areas,
  relationship_status,
  exam_career_pressure,
  preferred_language,
  comfort_style,
  support_depth,
  communication_preference
) values (
  '11111111-1111-1111-1111-111111111111',
  'Aarav',
  array['Crack PM interviews', 'Stop panic cycles'],
  array['Placements', 'Sleep debt', 'Overthinking'],
  'Talking stage',
  'Placement season in 2 months',
  'hinglish',
  'Warm and grounded',
  78,
  'Big-brother mentor with practical steps'
) on conflict do nothing;

insert into public.conversations (
  id,
  user_id,
  title,
  pinned,
  last_message_preview,
  tone_badge,
  language_badge
) values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Interview spiral',
  true,
  'Let’s map the fear before we solve it.',
  'Big Brother',
  'hinglish'
) on conflict do nothing;

insert into public.messages (
  conversation_id,
  user_id,
  role,
  content,
  tone_style,
  language
) values
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'user',
    'bro dimag kharab ho raha hai, interview ka naam sunte hi panic aa raha hai',
    'warm_friend',
    'hinglish'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'assistant',
    'Sun, panic ka matlab weak hona nahi hota. Pehle body ko calm karte hain, phir interview solve karte hain.',
    'big_brother',
    'hinglish'
  ) on conflict do nothing;

insert into public.memories (
  user_id,
  title,
  category,
  summary,
  confidence,
  pinned,
  visibility
) values
  (
    '11111111-1111-1111-1111-111111111111',
    'Placement season is a major trigger',
    'study_stress',
    'Interview anxiety spikes when comparing with peers on LinkedIn.',
    0.91,
    true,
    'assistant_only'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'Values thoughtful communication',
    'relationship_issues',
    'Prefers not to reply while emotionally flooded and appreciates slow clarity.',
    0.83,
    true,
    'shared'
  ) on conflict do nothing;

# Understanding Autism — Series Bible

> **"Understanding Starts With Listening."**

A short-form educational video series (2–3 minutes per episode) that helps
parents, families, teachers, healthcare professionals and the general public
understand autism. It's created by Matty, a parent of a non-speaking autistic
child.

This folder holds everything needed to produce the series the same way every
time:

| File | Purpose |
| --- | --- |
| `README.md` | Series bible: branding, tone, language guide, episode plan, pipeline |
| `episode-generator-prompt.md` | Reusable prompt that makes any future episode in the same format |
| `episodes/01-what-is-autism.md` | Episode 1, the complete production pack |

---

## 1. Branding

**Series name:** Understanding Autism
_(Other names considered: Autism Uncovered, Different Not Less, Through
Autistic Eyes, The Autism Journey.)_

**Slogan:** "Understanding Starts With Listening."
_(Other slogans considered: "Different Minds. Different Strengths." / "See the
Person, Not the Diagnosis." / "Autism Explained, One Story at a Time.")_

**Colour palette**

| Role | Colour | Hex |
| --- | --- | --- |
| Primary | Calm blue | `#2F6FDE` |
| Secondary | Teal | `#14A3A3` |
| Accent | Soft purple | `#7B5CD6` |
| Text | Deep navy | `#1B2340` |
| Background | Off-white | `#FAFAF7` |

**Typography:** a rounded, highly legible sans-serif (for example Nunito,
Atkinson Hyperlegible or Lexend). Use sentence case. No all-caps blocks of text.

**Visual style:** a bright, happy, colourful children's cartoon. Sunny skies,
green hills, smiling sun, diverse cartoon children, rounded shapes and a
playful rounded font (Fredoka). Motion is bouncy but gentle, with no flashing or
strobing. The mood is always uplifting. Accessibility and sensory comfort are
part of the brand.

### Logo prompt

```
Create a modern, professional logo for an autism video series called
"Understanding Autism".

Style:
- Clean and simple, flat vector style
- Blue (#2F6FDE), teal (#14A3A3) and purple (#7B5CD6) colour palette
- Inclusive and welcoming
- Symbol: several distinct, differently shaped flowing lines or thought-paths
  that meet and connect in the centre, representing different ways of thinking
  connecting together (a loose infinity-loop feel is welcome)
- Do NOT use a puzzle piece
- Works at small sizes (YouTube avatar, TikTok profile picture)

Include the series name "Understanding Autism" and the slogan
"Understanding Starts With Listening" in a rounded sans-serif font.

White background, high resolution, vector style.
```

> **Why no puzzle piece?** Many autistic adults dislike it because it suggests
> autistic people are "puzzling" or "missing a piece". The infinity symbol is
> widely preferred in the autistic community.

---

## 2. Tone and audience

**Tone:** warm, human, educational, positive, inclusive.
**Audience:** parents, families, teachers, healthcare professionals, general public.

**Always:**
- Explain ideas with simple, everyday examples (supermarkets, school runs,
  birthday parties).
- Balance strengths **and** challenges honestly.
- Centre autistic people's own voices where possible.
- Be accurate and evidence-based. Every episode ends with a fact-check list.

**Never:**
- Use fear-based messaging ("epidemic", "tragedy", "stolen child").
- Talk about "curing" or "fixing" autistic people.
- Use flashing or strobe effects, or sudden loud sound effects.

### Language guide

| Prefer | Avoid | Why |
| --- | --- | --- |
| autistic person / autistic child | person who suffers from autism | Many UK autistic adults prefer identity-first language, and autism is not suffering |
| non-speaking / minimally speaking | non-verbal (acceptable, but less precise) | Many people who don't speak still understand and use language |
| support needs (high / low) | high-functioning / low-functioning | Functioning labels hide real needs or real abilities |
| difference, condition | disease, disorder (outside clinical quotes) | Autism is not an illness |
| autism acceptance / understanding | autism awareness only | The community is asking for more than awareness |
| strengths | superpowers | Some autistic people find "superpowers" dismissive of real challenges |

> **Episode 9 tweak:** consider retitling "Autism Strengths and Superpowers"
> to **"Autistic Strengths"** for the reason above.

---

## 3. Episode plan

| # | Title | Length | Status |
| --- | --- | --- | --- |
| 1 | What Is Autism? | 2–3 min | ✅ Drafted, see `episodes/01-what-is-autism.md` |
| 2 | Common Myths About Autism | 2–3 min | ⏳ |
| 3 | Sensory Differences Explained | 2–3 min | ⏳ |
| 4 | Communication and Autism | 2–3 min | ⏳ |
| 5 | Understanding Meltdowns | 2–3 min | ⏳ |
| 6 | Autism in School | 2–3 min | ⏳ |
| 7 | Autism and Friendships | 2–3 min | ⏳ |
| 8 | Supporting an Autistic Child | 2–3 min | ⏳ |
| 9 | Autistic Strengths | 2–3 min | ⏳ |
| 10 | A Day in the Life of an Autistic Child | 2–3 min | ⏳ |

Work on one episode at a time. Get it polished and published before moving on.

### Storyboard structure (every episode)

| Scene | Beat | Target length |
| --- | --- | --- |
| 1 | Hook | 5–10 s |
| 2 | Introduce topic | ~15 s |
| 3 | Explain concept simply | ~20 s |
| 4 | Real-life example | ~20 s |
| 5 | Deeper understanding | ~20 s |
| 6 | Common misconception | ~15 s |
| 7 | Reality | ~20–25 s |
| 8 | Positive message | ~20 s |
| 9 | Summary | ~15 s |
| 10 | Call to action | ~15 s |

At about 140 spoken words per minute, a 2:30–2:50 video needs roughly
**350–400 words** of voiceover.

---

## 4. Production pipeline

```
Claude            → script, storyboard, prompts (episode-generator-prompt.md)
ChatGPT / Copilot → optional second pass to refine wording
ElevenLabs        → narration in Matty's cloned voice
Runway / Kling / Veo → AI-generated scenes (from the per-scene video prompts)
CapCut            → final edit, captions, music, text overlays
```

### Voice clone (ElevenLabs)

1. Create an ElevenLabs account. Professional Voice Cloning needs a paid tier.
2. Record 30–60 minutes of clean audio:
   - quiet room with soft furnishings (a wardrobe full of clothes works well)
   - consistent distance from the mic, about a hand-span away
   - read naturally, in the same warm tone you want in the videos
   - reading past scripts from this series is ideal training material
3. Upload the recording and create the Professional Voice Clone.
4. Generate narration scene by scene, so you can re-do a single line without
   re-rendering the whole script.

### Publishing checklist (every episode)

- [ ] Every item on the episode's fact-check list is verified
- [ ] Burned-in captions on (many viewers watch muted, and captions help accessibility)
- [ ] No flashing, strobing or sudden loud sounds
- [ ] Music ducked under the voiceover (about −18 to −22 dB)
- [ ] Any real footage of a child has the consent of the parent or carer, and
      the child's name and school aren't shown
- [ ] AI-generated footage is labelled if the platform requires it
      (YouTube "altered or synthetic content", TikTok AI label)
- [ ] Thumbnail, description and pinned comment added

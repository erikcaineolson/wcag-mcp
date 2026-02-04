import type { CheckResult } from "@wcag-mcp/core";

// =============================================================================
// Types
// =============================================================================

export type MediaType = "audio" | "video" | "audio-video";

export interface CaptionInput {
  /** Type of media */
  mediaType: MediaType;
  /** Whether media is prerecorded or live */
  isLive: boolean;
  /** Whether captions are provided */
  hasCaptions: boolean;
  /** Whether captions are synchronized */
  areSynchronized?: boolean;
  /** Whether captions include speaker identification */
  hasSpackerIdentification?: boolean;
  /** Whether captions include non-speech audio (sound effects, music) */
  includesNonSpeechAudio?: boolean;
  /** Caption format (open, closed) */
  captionType?: "open" | "closed";
}

export interface AudioDescriptionInput {
  /** Whether media has video content */
  hasVideoContent: boolean;
  /** Whether media is prerecorded */
  isPrerecorded: boolean;
  /** Whether audio description is provided */
  hasAudioDescription: boolean;
  /** Whether extended audio description is available */
  hasExtendedDescription?: boolean;
  /** Whether pauses in audio are sufficient for description */
  pausesAreSufficient?: boolean;
  /** Whether media alternative (transcript) is provided */
  hasMediaAlternative?: boolean;
}

export interface TranscriptInput {
  /** Type of media */
  mediaType: MediaType;
  /** Whether transcript is provided */
  hasTranscript: boolean;
  /** Whether transcript is synchronized */
  isSynchronized?: boolean;
  /** Whether transcript includes visual descriptions */
  includesVisualDescriptions?: boolean;
  /** Whether transcript is easily accessible */
  isAccessible?: boolean;
}

export interface MediaControlInput {
  /** Whether media autoplays */
  autoplays: boolean;
  /** Duration in seconds if autoplays */
  autoplayDuration?: number;
  /** Whether pause control is available */
  canPause?: boolean;
  /** Whether stop control is available */
  canStop?: boolean;
  /** Whether volume control is available */
  hasVolumeControl?: boolean;
  /** Whether mute control is available */
  canMute?: boolean;
}

export interface AnimationInput {
  /** Whether page has auto-playing animation */
  hasAutoAnimation: boolean;
  /** Duration in seconds */
  duration?: number;
  /** Whether animation can be paused */
  canPause?: boolean;
  /** Whether animation can be stopped */
  canStop?: boolean;
  /** Whether animation can be hidden */
  canHide?: boolean;
  /** Whether animation is essential */
  isEssential?: boolean;
}

export interface FlashingInput {
  /** Whether content flashes */
  hasFlashing: boolean;
  /** Flash frequency per second */
  flashesPerSecond?: number;
  /** Size of flashing area in viewport percentage */
  flashAreaPercent?: number;
  /** Whether flashing is below threshold */
  isBelowThreshold?: boolean;
}

// =============================================================================
// Check Functions
// =============================================================================

export function checkCaptions(input: CaptionInput): CheckResult[] {
  const results: CheckResult[] = [];

  // Only applies to media with audio
  if (input.mediaType === "video") {
    results.push({
      criterion: "1.2.2",
      name: "Captions (Prerecorded)",
      level: "A",
      status: "info",
      message: "Video-only content without audio does not require captions",
    });
    return results;
  }

  if (input.isLive) {
    // 1.2.4 Captions (Live) - Level AA
    results.push({
      criterion: "1.2.4",
      name: "Captions (Live)",
      level: "AA",
      status: input.hasCaptions ? "pass" : "fail",
      value: input.hasCaptions,
      message: input.hasCaptions
        ? "Live captions are provided"
        : "Live media lacks captions",
      recommendation: input.hasCaptions
        ? undefined
        : "Provide real-time captions for live audio content",
    });
  } else {
    // 1.2.2 Captions (Prerecorded) - Level A
    results.push({
      criterion: "1.2.2",
      name: "Captions (Prerecorded)",
      level: "A",
      status: input.hasCaptions ? "pass" : "fail",
      value: input.hasCaptions,
      message: input.hasCaptions
        ? "Captions are provided for prerecorded media"
        : "Prerecorded media lacks captions",
      recommendation: input.hasCaptions
        ? undefined
        : "Provide synchronized captions for all prerecorded audio content",
    });

    // Check caption quality
    if (input.hasCaptions) {
      if (input.areSynchronized === false) {
        results.push({
          criterion: "1.2.2",
          name: "Captions (Prerecorded)",
          level: "A",
          status: "warning",
          message: "Captions may not be properly synchronized",
          recommendation: "Ensure captions are synchronized with the audio",
        });
      }

      if (input.includesNonSpeechAudio === false) {
        results.push({
          criterion: "1.2.2",
          name: "Captions (Prerecorded)",
          level: "A",
          status: "warning",
          message: "Captions may not include non-speech audio (sound effects, music)",
          recommendation: "Include descriptions of relevant sound effects and music in captions",
        });
      }
    }
  }

  return results;
}

export function checkAudioDescription(input: AudioDescriptionInput): CheckResult[] {
  const results: CheckResult[] = [];

  if (!input.hasVideoContent) {
    results.push({
      criterion: "1.2.5",
      name: "Audio Description (Prerecorded)",
      level: "AA",
      status: "info",
      message: "Audio description only applies to video content",
    });
    return results;
  }

  if (!input.isPrerecorded) {
    results.push({
      criterion: "1.2.5",
      name: "Audio Description (Prerecorded)",
      level: "AA",
      status: "info",
      message: "Audio description requirement applies to prerecorded content",
    });
    return results;
  }

  // 1.2.3 Audio Description or Media Alternative - Level A
  const hasAlternative = input.hasAudioDescription || input.hasMediaAlternative;
  results.push({
    criterion: "1.2.3",
    name: "Audio Description or Media Alternative (Prerecorded)",
    level: "A",
    status: hasAlternative ? "pass" : "fail",
    value: hasAlternative,
    message: hasAlternative
      ? `Alternative provided: ${[
          input.hasAudioDescription && "audio description",
          input.hasMediaAlternative && "media alternative/transcript",
        ].filter(Boolean).join(", ")}`
      : "No audio description or media alternative provided",
    recommendation: hasAlternative
      ? undefined
      : "Provide audio description or full text alternative for video content",
  });

  // 1.2.5 Audio Description (Prerecorded) - Level AA
  results.push({
    criterion: "1.2.5",
    name: "Audio Description (Prerecorded)",
    level: "AA",
    status: input.hasAudioDescription ? "pass" : "fail",
    value: input.hasAudioDescription,
    message: input.hasAudioDescription
      ? "Audio description is provided"
      : "Audio description is not provided",
    recommendation: input.hasAudioDescription
      ? undefined
      : "Provide audio description for visual information not available from audio track",
  });

  // 1.2.7 Extended Audio Description - Level AAA
  if (input.pausesAreSufficient === false) {
    results.push({
      criterion: "1.2.7",
      name: "Extended Audio Description (Prerecorded)",
      level: "AAA",
      status: input.hasExtendedDescription ? "pass" : "warning",
      value: input.hasExtendedDescription,
      message: input.hasExtendedDescription
        ? "Extended audio description is provided where pauses are insufficient"
        : "Pauses may be insufficient for audio description; consider extended description",
      recommendation: input.hasExtendedDescription
        ? undefined
        : "Provide extended audio description that pauses video for additional description",
    });
  }

  return results;
}

export function checkTranscript(input: TranscriptInput): CheckResult[] {
  const results: CheckResult[] = [];

  // 1.2.1 Audio-only and Video-only (Prerecorded) - Level A
  if (input.mediaType === "audio") {
    results.push({
      criterion: "1.2.1",
      name: "Audio-only and Video-only (Prerecorded)",
      level: "A",
      status: input.hasTranscript ? "pass" : "fail",
      value: input.hasTranscript,
      message: input.hasTranscript
        ? "Transcript provided for audio-only content"
        : "Audio-only content lacks transcript",
      recommendation: input.hasTranscript
        ? undefined
        : "Provide a text transcript for audio-only content",
    });
  }

  if (input.mediaType === "video") {
    results.push({
      criterion: "1.2.1",
      name: "Audio-only and Video-only (Prerecorded)",
      level: "A",
      status: input.hasTranscript ? "pass" : "fail",
      value: input.hasTranscript,
      message: input.hasTranscript
        ? "Alternative provided for video-only content"
        : "Video-only content lacks text alternative or audio track",
      recommendation: input.hasTranscript
        ? undefined
        : "Provide text alternative or audio track describing video content",
    });
  }

  // 1.2.8 Media Alternative (Prerecorded) - Level AAA
  if (input.mediaType === "audio-video") {
    const hasFullAlternative = input.hasTranscript && input.includesVisualDescriptions;
    results.push({
      criterion: "1.2.8",
      name: "Media Alternative (Prerecorded)",
      level: "AAA",
      status: hasFullAlternative ? "pass" : "warning",
      value: hasFullAlternative,
      message: hasFullAlternative
        ? "Full media alternative (transcript with visual descriptions) is provided"
        : "Consider providing complete text alternative including visual descriptions",
      recommendation: hasFullAlternative
        ? undefined
        : "Provide transcript that includes all audio and visual information",
    });
  }

  return results;
}

export function checkMediaControls(input: MediaControlInput): CheckResult[] {
  const results: CheckResult[] = [];

  if (!input.autoplays) {
    results.push({
      criterion: "1.4.2",
      name: "Audio Control",
      level: "A",
      status: "pass",
      message: "Media does not autoplay",
    });
    return results;
  }

  // 1.4.2 Audio Control - Level A
  // Applies if audio plays automatically for more than 3 seconds
  const exceedsThreshold = (input.autoplayDuration ?? 0) > 3;

  if (!exceedsThreshold) {
    results.push({
      criterion: "1.4.2",
      name: "Audio Control",
      level: "A",
      status: "pass",
      message: "Autoplay duration is 3 seconds or less",
    });
    return results;
  }

  const hasControl = input.canPause || input.canStop || input.canMute || input.hasVolumeControl;

  results.push({
    criterion: "1.4.2",
    name: "Audio Control",
    level: "A",
    status: hasControl ? "pass" : "fail",
    value: hasControl,
    message: hasControl
      ? `Audio control available: ${[
          input.canPause && "pause",
          input.canStop && "stop",
          input.canMute && "mute",
          input.hasVolumeControl && "volume control",
        ].filter(Boolean).join(", ")}`
      : "Auto-playing audio lacks mechanism to pause, stop, or control volume",
    recommendation: hasControl
      ? undefined
      : "Provide mechanism to pause, stop, or control audio volume independent of system volume",
  });

  return results;
}

export function checkAnimation(input: AnimationInput): CheckResult[] {
  const results: CheckResult[] = [];

  if (!input.hasAutoAnimation) {
    results.push({
      criterion: "2.2.2",
      name: "Pause, Stop, Hide",
      level: "A",
      status: "pass",
      message: "No auto-playing animation detected",
    });
    return results;
  }

  if (input.isEssential) {
    results.push({
      criterion: "2.2.2",
      name: "Pause, Stop, Hide",
      level: "A",
      status: "pass",
      message: "Animation is essential to the content",
    });
    return results;
  }

  // 2.2.2 Pause, Stop, Hide - Level A
  // Applies if animation starts automatically and lasts more than 5 seconds
  const exceedsThreshold = (input.duration ?? 6) > 5;

  if (!exceedsThreshold) {
    results.push({
      criterion: "2.2.2",
      name: "Pause, Stop, Hide",
      level: "A",
      status: "pass",
      message: "Animation duration is 5 seconds or less",
    });
    return results;
  }

  const hasControl = input.canPause || input.canStop || input.canHide;

  results.push({
    criterion: "2.2.2",
    name: "Pause, Stop, Hide",
    level: "A",
    status: hasControl ? "pass" : "fail",
    value: hasControl,
    message: hasControl
      ? `Animation control available: ${[
          input.canPause && "pause",
          input.canStop && "stop",
          input.canHide && "hide",
        ].filter(Boolean).join(", ")}`
      : "Auto-playing animation lacks mechanism to pause, stop, or hide",
    recommendation: hasControl
      ? undefined
      : "Provide mechanism to pause, stop, or hide moving, blinking, or scrolling content",
  });

  // 2.3.3 Animation from Interactions - Level AAA
  results.push({
    criterion: "2.3.3",
    name: "Animation from Interactions",
    level: "AAA",
    status: input.canPause || input.canStop ? "pass" : "warning",
    message: input.canPause || input.canStop
      ? "Motion animation can be disabled"
      : "Consider allowing users to disable motion animation (respects prefers-reduced-motion)",
    recommendation: input.canPause || input.canStop
      ? undefined
      : "Honor prefers-reduced-motion media query and provide option to disable animation",
  });

  return results;
}

export function checkFlashing(input: FlashingInput): CheckResult[] {
  const results: CheckResult[] = [];

  if (!input.hasFlashing) {
    results.push({
      criterion: "2.3.1",
      name: "Three Flashes or Below Threshold",
      level: "A",
      status: "pass",
      message: "No flashing content detected",
    });
    return results;
  }

  // 2.3.1 Three Flashes or Below Threshold - Level A
  const flashesPerSecond = input.flashesPerSecond ?? 0;
  const isSafe = flashesPerSecond <= 3 || input.isBelowThreshold;

  results.push({
    criterion: "2.3.1",
    name: "Three Flashes or Below Threshold",
    level: "A",
    status: isSafe ? "pass" : "fail",
    value: flashesPerSecond,
    required: 3,
    message: isSafe
      ? `Flashing content is safe (${flashesPerSecond} flashes/sec or below threshold)`
      : `Content flashes ${flashesPerSecond} times per second, exceeding safe threshold`,
    recommendation: isSafe
      ? undefined
      : "Reduce flash frequency to 3 or fewer per second, or ensure flashes are below general flash threshold",
  });

  // 2.3.2 Three Flashes - Level AAA
  const noFlashing = flashesPerSecond === 0;
  results.push({
    criterion: "2.3.2",
    name: "Three Flashes",
    level: "AAA",
    status: noFlashing ? "pass" : "warning",
    value: flashesPerSecond,
    message: noFlashing
      ? "Content does not flash (meets AAA)"
      : `Content flashes ${flashesPerSecond} times per second - consider removing for AAA`,
    recommendation: noFlashing
      ? undefined
      : "For AAA compliance, avoid any flashing content",
  });

  // Large area warning
  if ((input.flashAreaPercent ?? 0) > 25) {
    results.push({
      criterion: "2.3.1",
      name: "Three Flashes or Below Threshold",
      level: "A",
      status: "warning",
      value: input.flashAreaPercent,
      message: `Flashing area (${input.flashAreaPercent}% of viewport) is large`,
      recommendation: "Large flashing areas increase seizure risk; minimize flashing area size",
    });
  }

  return results;
}

export function checkSignLanguage(input: {
  hasAudioContent: boolean;
  isPrerecorded: boolean;
  hasSignLanguage: boolean;
}): CheckResult[] {
  const results: CheckResult[] = [];

  if (!input.hasAudioContent || !input.isPrerecorded) {
    return results;
  }

  // 1.2.6 Sign Language (Prerecorded) - Level AAA
  results.push({
    criterion: "1.2.6",
    name: "Sign Language (Prerecorded)",
    level: "AAA",
    status: input.hasSignLanguage ? "pass" : "warning",
    value: input.hasSignLanguage,
    message: input.hasSignLanguage
      ? "Sign language interpretation is provided"
      : "Consider providing sign language interpretation for deaf users",
    recommendation: input.hasSignLanguage
      ? undefined
      : "Provide sign language interpretation for all prerecorded audio content",
  });

  return results;
}

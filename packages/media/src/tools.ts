import type { ToolDefinition } from "@wcag-mcp/core";

export const MEDIA_TOOLS: ToolDefinition[] = [
  {
    name: "check_captions",
    description: "Check WCAG caption requirements (1.2.2, 1.2.4). Validates synchronized captions for audio content.",
    inputSchema: {
      type: "object",
      properties: {
        mediaType: { type: "string", enum: ["audio", "video", "audio-video"], description: "Type of media" },
        isLive: { type: "boolean", description: "Whether media is live or prerecorded" },
        hasCaptions: { type: "boolean", description: "Whether captions are provided" },
        areSynchronized: { type: "boolean", description: "Whether captions are synchronized with audio" },
        hasSpeakerIdentification: { type: "boolean", description: "Whether captions identify speakers" },
        includesNonSpeechAudio: { type: "boolean", description: "Whether captions include sound effects/music" },
        captionType: { type: "string", enum: ["open", "closed"], description: "Caption type" },
      },
      required: ["mediaType", "isLive", "hasCaptions"],
    },
  },
  {
    name: "check_audio_description",
    description: "Check WCAG audio description requirements (1.2.3, 1.2.5, 1.2.7). Validates audio description for video content.",
    inputSchema: {
      type: "object",
      properties: {
        hasVideoContent: { type: "boolean", description: "Whether media has video content" },
        isPrerecorded: { type: "boolean", description: "Whether media is prerecorded" },
        hasAudioDescription: { type: "boolean", description: "Whether audio description is provided" },
        hasExtendedDescription: { type: "boolean", description: "Whether extended audio description is available" },
        pausesAreSufficient: { type: "boolean", description: "Whether natural pauses allow for description" },
        hasMediaAlternative: { type: "boolean", description: "Whether full text transcript is provided" },
      },
      required: ["hasVideoContent", "isPrerecorded", "hasAudioDescription"],
    },
  },
  {
    name: "check_transcript",
    description: "Check WCAG transcript requirements (1.2.1, 1.2.8). Validates text alternatives for media.",
    inputSchema: {
      type: "object",
      properties: {
        mediaType: { type: "string", enum: ["audio", "video", "audio-video"], description: "Type of media" },
        hasTranscript: { type: "boolean", description: "Whether transcript is provided" },
        isSynchronized: { type: "boolean", description: "Whether transcript is synchronized" },
        includesVisualDescriptions: { type: "boolean", description: "Whether transcript describes visual content" },
        isAccessible: { type: "boolean", description: "Whether transcript is easily accessible" },
      },
      required: ["mediaType", "hasTranscript"],
    },
  },
  {
    name: "check_media_controls",
    description: "Check WCAG 1.4.2 Audio Control. Validates auto-playing media has pause/stop/volume controls.",
    inputSchema: {
      type: "object",
      properties: {
        autoplays: { type: "boolean", description: "Whether media autoplays" },
        autoplayDuration: { type: "number", description: "Duration of autoplay in seconds" },
        canPause: { type: "boolean", description: "Whether media can be paused" },
        canStop: { type: "boolean", description: "Whether media can be stopped" },
        hasVolumeControl: { type: "boolean", description: "Whether volume control is available" },
        canMute: { type: "boolean", description: "Whether media can be muted" },
      },
      required: ["autoplays"],
    },
  },
  {
    name: "check_animation",
    description: "Check WCAG 2.2.2 Pause, Stop, Hide. Validates auto-playing animation can be controlled.",
    inputSchema: {
      type: "object",
      properties: {
        hasAutoAnimation: { type: "boolean", description: "Whether page has auto-playing animation" },
        duration: { type: "number", description: "Animation duration in seconds" },
        canPause: { type: "boolean", description: "Whether animation can be paused" },
        canStop: { type: "boolean", description: "Whether animation can be stopped" },
        canHide: { type: "boolean", description: "Whether animation can be hidden" },
        isEssential: { type: "boolean", description: "Whether animation is essential to content" },
      },
      required: ["hasAutoAnimation"],
    },
  },
  {
    name: "check_flashing",
    description: "Check WCAG 2.3.1 and 2.3.2 flash thresholds. Validates content doesn't flash dangerously.",
    inputSchema: {
      type: "object",
      properties: {
        hasFlashing: { type: "boolean", description: "Whether content flashes" },
        flashesPerSecond: { type: "number", description: "Number of flashes per second" },
        flashAreaPercent: { type: "number", description: "Flashing area as percentage of viewport" },
        isBelowThreshold: { type: "boolean", description: "Whether flashing is below general flash threshold" },
      },
      required: ["hasFlashing"],
    },
  },
  {
    name: "check_sign_language",
    description: "Check WCAG 1.2.6 Sign Language (AAA). Validates sign language interpretation availability.",
    inputSchema: {
      type: "object",
      properties: {
        hasAudioContent: { type: "boolean", description: "Whether media has audio content" },
        isPrerecorded: { type: "boolean", description: "Whether media is prerecorded" },
        hasSignLanguage: { type: "boolean", description: "Whether sign language interpretation is provided" },
      },
      required: ["hasAudioContent", "isPrerecorded", "hasSignLanguage"],
    },
  },
  {
    name: "get_wcag_media_criteria",
    description: "Get reference information for all WCAG 2.1 media-related success criteria.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

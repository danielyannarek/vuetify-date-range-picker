import presets, { primaryPresets, comparePresets } from "../../components/DatePicker/presets"

const defaultDateFormat = "MMM D, YYYY"
const defaultPrimaryPreset = "LAST_7_DAYS"
const defaultComparePreset = "PREVIOUS_PERIOD"

export default {
  debug: false,

  // date range picker config props and emitted values
  config: {
    compare: true,
  },

  // layout
  show_calendar_icon: true,
  show_presets_icon: true,

  // config
  compare: true,
  dark_theme: false,
  date_format: defaultDateFormat,

  // defaults
  default_date_format: defaultDateFormat,
  default_primary_preset: defaultPrimaryPreset,
  default_compare_preset: defaultComparePreset,

  // primary date range
  date_start: presets[defaultPrimaryPreset][0],
  date_until: presets[defaultPrimaryPreset][1],
  picker_active_mount: presets[defaultPrimaryPreset][0],
  picker_active_compare_mount: presets[defaultPrimaryPreset][0],

  // compare period date range
  compare_start: presets.PREVIOUS_PERIOD(presets[defaultPrimaryPreset])[0],
  compare_until: presets.PREVIOUS_PERIOD(presets[defaultPrimaryPreset])[1],

  // primary and compare presets
  primary_preset: defaultPrimaryPreset,
  compare_preset: defaultComparePreset,

  // primary and compare presets lists
  primary_presets: Object.keys(primaryPresets),
  compare_presets: Object.keys(comparePresets),

  // layout
  dialog_opened: false,
  picker_primary_active: true,
}

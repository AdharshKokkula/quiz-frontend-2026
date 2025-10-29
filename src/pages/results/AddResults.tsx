import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

type Option = { value: string; label: string };

type FormData = {
  team: Option[];
  round: string;
  rank: string;
};

const teamList = [
  "Team Alpha",
  "Team Bravo",
  "Team Charlie",
  "Team Delta",
  "Team Echo",
  "Team Foxtrot",
  "Team Golf",
  "Team Hotel",
];

const roundOptions: Option[] = [
  { value: "preliminary", label: "Preliminary" },
  { value: "screeningtest", label: "Screening Test" },
  { value: "semifinals", label: "Semi Finals" },
  { value: "finals", label: "Finals" },
];

const rankOptions: Option[] = [
  { value: "disqualified", label: "Disqualified" },
  { value: "qualified", label: "Qualified" },
  { value: "3rd", label: "3rd" },
  { value: "2nd", label: "2nd" },
  { value: "1st", label: "1st" },
];

export default function AddResultsPage() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      team: [],
      round: "",
      rank: "",
    },
  });

  const teamOptions: Option[] = teamList.map((t) => ({
    value: t,
    label: t,
  }));

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h2">Add Results</h1>
      </div>

      <form className="container" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* Team Selector */}
          <div className="col-sm-4 mb-3">
            <label htmlFor="team" className="form-label">
              Select Team
            </label>
            <Controller
              name="team"
              control={control}
              rules={{ required: "Please select at least one team" }}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={teamOptions}
                  placeholder="Select team(s)..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  closeMenuOnSelect={false}
                  noOptionsMessage={() => "No teams"}
                />
              )}
            />
            {errors.team && (
              <span className="text-danger">{errors.team.message}</span>
            )}
          </div>

          {/* Round Selector */}
          <div className="col-sm-4 mb-3">
            <label htmlFor="round" className="form-label">
              Round
            </label>
            <select
              id="round"
              className="form-select"
              {...register("round", { required: "Round field is required" })}
            >
              <option value="">Select Round</option>
              {roundOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {errors.round && (
              <span className="text-danger">{errors.round.message}</span>
            )}
          </div>

          {/* Rank Selector */}
          <div className="col-sm-4 mb-3">
            <label htmlFor="rank" className="form-label">
              Rank
            </label>
            <select
              id="rank"
              className="form-select"
              {...register("rank", { required: "Rank field is required" })}
            >
              <option value="">Select Rank</option>
              {rankOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {errors.rank && (
              <span className="text-danger">{errors.rank.message}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="col-sm-12 my-5">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

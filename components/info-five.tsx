import LogoThree from "./logoThree";
import StepIndicator from "./step-indicator";
import { Card, CardContent, CardTitle, CardDescription } from "./ui/card";

export default function InfoFive() {
  return (
    <div className="w-full max-w-[550px] mx-auto flex mt-20">
      <Card className="border-none shadow-none bg-sidebar">
        <CardContent className="pt-8 pb-4 px-6">
          <div className="space-y-5 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12">
                <LogoThree />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-center">
              Welcome to Trizzy
            </CardTitle>
            <CardDescription className="text-center">
              You don&apos;t have any trained models yet. To get started with
              Trizzy, you&apos;ll need to train an AI model on your face.
            </CardDescription>

            <div className="">
              <CardTitle className="text-lg font-semibold text-center mb-4">
                How it works
              </CardTitle>
              {/* <ol className="list-decimal pl-5 space-y-2 text-sm text-left text-muted-foreground">
                <li>Name your model and choose your gender</li>
                <li>Upload 5-10 clear, front-facing photos of yourself</li>
                <li>
                  Wait for training to complete (usually takes 15-20 minutes)
                </li>
                <li>Try on virtual outfits with your new AI model!</li>
              </ol> */}
              <div className="flex flex-col gap-2 w-full">
                <StepIndicator
                  number={1}
                  text="Name your model and choose your gender"
                />
                <StepIndicator
                  number={2}
                  text="Upload 5-10 clear, front-facing photos of yourself"
                />
                <StepIndicator
                  number={3}
                  text="Wait for training to complete (usually takes 15-20 minutes)"
                />
                <StepIndicator
                  number={4}
                  text="Try on virtual outfits with your new AI model!"
                />
              </div>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter className="pb-6 px-6">
          <div className="w-full text-center">
            <p className="text-sm mb-2 text-muted-foreground">
              Start by uploading your photos in the form on the left
            </p>
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}

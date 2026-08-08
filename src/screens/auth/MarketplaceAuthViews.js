import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Button } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { styles } from "./authStyles";

export function SplashScreen() {
  return (
    <View style={styles.splash}>
      <View style={styles.splashLogo}>
        <Icon name="bag-handle-outline" size={54} color="#fff" />
      </View>
      <Text style={styles.splashBrand}>Verdant</Text>
      <Text style={styles.splashCopy}>Shop Smarter. Live Better.</Text>
      <View style={styles.splashDots}>
        <View style={styles.splashDot} />
        <View style={styles.splashDotActive} />
        <View style={styles.splashDot} />
      </View>
    </View>
  );
}
export function OnboardingScreen({ onDone, onSkip }) {
  const [step, setStep] = useState(0);
  const slides = [
    [
      "bag-handle-outline",
      "Millions of Products",
      "Discover deals from thousands of trusted sellers all in one place.",
    ],
    [
      "flash-outline",
      "Deals Made For You",
      "Find the best prices from stores you can trust.",
    ],
    [
      "cube-outline",
      "Delivered With Care",
      "Track every order from checkout to your door.",
    ],
  ];
  const slide = slides[step];
  return (
    <View style={styles.referenceOnboarding}>
      <View style={styles.onboardingGreen}>
        <View style={styles.bagCircle}>
          <Icon name={slide[0]} size={84} color="#fff" />
        </View>
        <Text style={styles.referenceOnboardTitle}>{slide[1]}</Text>
        <Text style={styles.referenceOnboardCopy}>{slide[2]}</Text>
      </View>
      <View style={styles.onboardingWhite}>
        <View style={styles.referenceDots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.referenceDot,
                i === step && styles.referenceDotActive,
              ]}
            />
          ))}
        </View>
        <Button
          label={step === 2 ? "Get Started" : "Next"}
          onPress={() => (step === 2 ? onDone() : setStep(step + 1))}
        />
        <Pressable onPress={onSkip} hitSlop={12}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}
export function AuthScreen({ onBack, onSuccess }) {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submit = () => {
    if (
      !email ||
      !password ||
      (register && (!firstName || !lastName || !phone || !agreed))
    )
      return Alert.alert(
        "Lengkapi data",
        register
          ? "Isi seluruh data dan setujui ketentuan."
          : "Masukkan email dan password untuk melanjutkan.",
      );
    onSuccess({
      name: register ? `${firstName} ${lastName}` : email.split("@")[0],
      email,
    });
  };
  return (
    <ScrollView
      style={styles.authPage}
      contentContainerStyle={[styles.referenceAuth, !register && styles.loginAuth]}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={register}
    >
      <View style={[styles.authHero, !register && styles.loginAuthHero, register && styles.registerHero]}>
        {register && <Pressable onPress={onBack} hitSlop={12}>
          <Icon name="chevron-back" size={30} color="#fff" />
        </Pressable>}
        <View style={styles.authStoreIcon}>
          <Icon name="storefront-outline" size={36} color="#fff" />
        </View>
        <Text style={[styles.authHeroTitle, !register && styles.loginAuthHeroTitle]}>
          {register ? "Create account" : "Welcome back"}
        </Text>
        <Text style={[styles.authHeroCopy, !register && styles.loginAuthHeroCopy]}>
          {register
            ? "Join millions of happy shoppers"
            : "Sign in to continue shopping"}
        </Text>
      </View>
      <View style={[styles.authPanel, !register && styles.loginAuthPanel]}>
        {register ? (
          <>
            <View style={styles.nameRow}>
              <ReferenceInput
                label="FIRST NAME"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                compact
              />
              <ReferenceInput
                label="LAST NAME"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                compact
              />
            </View>
            <ReferenceInput
              label="EMAIL ADDRESS"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              keyboardType="email-address"
            />
            <ReferenceInput
              label="PHONE NUMBER"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </>
        ) : (
          <ReferenceInput
            label="EMAIL OR PHONE"
            value={email}
            onChangeText={setEmail}
            placeholder="alex.johnson@email.com"
            icon="mail-outline"
            dense
          />
        )}
        <ReferenceInput
          label="PASSWORD"
          value={password}
          onChangeText={setPassword}
          placeholder={register ? "Enter password" : "••••••••"}
          icon="lock-closed-outline"
          secureTextEntry={!showPassword}
          rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
          onRightIconPress={() => setShowPassword(!showPassword)}
          dense={!register}
        />
        {!register && (
          <Pressable>
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>
        )}
        {register && (
          <Pressable
            onPress={() => setAgreed(!agreed)}
            style={styles.agreement}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed ? <Icon name="checkmark" size={16} color="#fff" /> : null}
            </View>
            <Text style={styles.agreementText}>
              I agree to the{" "}
              <Text style={styles.agreementLink}>Terms of Service</Text> and{" "}
              <Text style={styles.agreementLink}>Privacy Policy</Text>
            </Text>
          </Pressable>
        )}
        <Button
          label={register ? "Create Account" : "Sign In"}
          onPress={submit}
        />
        {!register && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.socialRow}>
              <SocialButton label="Google" icon="logo-google" />
              <SocialButton label="Apple" icon="logo-apple" />
            </View>
          </>
        )}
        <Pressable onPress={() => setRegister(!register)}>
          <Text style={styles.switchAuth}>
            {register ? (
              <>
                Already have an account?{" "}
                <Text style={styles.greenLink}>Sign In</Text>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Text style={styles.greenLink}>Sign Up</Text>
              </>
            )}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
function ReferenceInput({ label, compact, dense, icon, rightIcon, onRightIconPress, ...props }) {
  return (
    <View style={[styles.referenceInputWrap, dense && styles.loginInputWrap, compact && { flex: 1 }]}>
      <Text style={[styles.referenceLabel, dense && styles.loginInputLabel]}>{label}</Text>
      <View style={[styles.referenceInput, dense && styles.loginReferenceInput]}>
        {icon ? <Icon name={icon} size={19} color="#98A2B3" /> : null}
        <TextInput
          placeholderTextColor="#98A2B3"
          style={[styles.referenceInputText, dense && styles.loginReferenceInputText]}
          {...props}
        />
        {rightIcon ? <Pressable onPress={onRightIconPress} hitSlop={10}><Icon name={rightIcon} size={21} color="#98A2B3" /></Pressable> : null}
      </View>
    </View>
  );
}
function SocialButton({ label, icon }) {
  return (
    <Pressable style={styles.socialButton}>
      <Icon name={icon} size={18} color="#344054" />
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}
